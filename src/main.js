import '@/assets/index.css'
import '@arco-design/web-vue/dist/arco.css'

import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import App from '@/App.vue'
import * as PIXI from 'pixi.js'
import { sound } from '@pixi/sound'
import * as pixiSpine from "@esotericsoftware/spine-pixi-v8";

const app = createApp(App);
app.use(ArcoVue);
app.use(ArcoVueIcon);

app.mount('#app');

window.loadComplete = false;

setInterval(() => {
    document.querySelectorAll('a[href]:not(.tag)').forEach((link) => {
        link.classList.add('tag');
        link.addEventListener('click', async (e) => {
            const url = link.getAttribute('href');
            e.preventDefault();
            document.querySelector('#curtain').style.display = 'block';
            setTimeout(() => {
                let a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.click();
            }, 900)
            setTimeout(() => (document.querySelector('#curtain').style.display = ''), 3000);
        })
    })
}, 1000);

export let memorialLobbies = [];
export let bgmNames = [];

async function loadSpine(memorialLobby)
{
    let pathname = window.location.pathname;
    if (!pathname.endsWith('/')) 
        pathname += '/';
    memorialLobby.skel = pathname + memorialLobby.skel;
    memorialLobby.atlas = pathname + memorialLobby.atlas;
    memorialLobby.bgm = pathname + memorialLobby.bgm;
    PIXI.Assets.add({ alias: memorialLobby.name + '_skeleton', src: memorialLobby.skel });
    PIXI.Assets.add({ alias: memorialLobby.name + '_atlas', src: memorialLobby.atlas });
    await PIXI.Assets.load([memorialLobby.name + '_skeleton', memorialLobby.name + '_atlas']);
    return pixiSpine.Spine.from({
        skeleton: memorialLobby.name + '_skeleton',
        atlas: memorialLobby.name + '_atlas',
    })
}

; (async function () {
    let _memorialLobbies = await fetch('./MemorialLobbies.json');
    _memorialLobbies = await _memorialLobbies.json();
    
    let randomMemorialLobbies = _memorialLobbies.random;
    let memorialLobbiesToUse = [..._memorialLobbies.fixed];
    for (let i = 0; i < _memorialLobbies.randomAmount; i++) {
        let memorialLobby = randomMemorialLobbies[Math.floor(Math.random() * randomMemorialLobbies.length)];
        randomMemorialLobbies = randomMemorialLobbies.filter(s => s.name !== memorialLobby.name);
        memorialLobbiesToUse.push(memorialLobby);
    }

    for (let i = 0; i < memorialLobbiesToUse.length; i++) {
        let memorialLobby = memorialLobbiesToUse[i];
        memorialLobbies.push({
            ...memorialLobby,
            spine: await loadSpine(memorialLobby)
        });
        let soundAlias = memorialLobby.bgm.split('/').pop().split('.')[0];
        if (!sound.exists(soundAlias))
            sound.add(soundAlias, {
                url: memorialLobby.bgm,
                loop: true,
                volume: 0.02
            });
        bgmNames.push(soundAlias);
    }
    window.loadComplete = true;
})()
