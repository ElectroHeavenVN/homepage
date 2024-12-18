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

window.l2d_complete = false;

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

export let studentsL2Ds = [];
export let bgmNames = [];

; (async function () {
    let students = await fetch('./MemorialLobbies.json');
    students = await students.json();
    let fixedStudents = students.fixed;
    let randomStudents = students.random;
    for (let i = 0; i < fixedStudents.length; i++) {
        let student = fixedStudents[i];
        let pathname = window.location.pathname;
        if (!pathname.endsWith('/')) 
            pathname += '/';
        student.skel = pathname + student.skel;
        student.atlas = pathname + student.atlas;
        student.bgm = pathname + student.bgm;
        PIXI.Assets.add({ alias: student.name + '_skeleton', src: student.skel });
        PIXI.Assets.add({ alias: student.name + '_atlas', src: student.atlas });
        await PIXI.Assets.load([student.name + '_skeleton', student.name + '_atlas']);
        studentsL2Ds.push({
            ...student,
            spine: pixiSpine.Spine.from({
                skeleton: student.name + '_skeleton',
                atlas: student.name + '_atlas',
            })
        })
        let soundAlias = student.bgm.split('/').pop().split('.')[0];
        if (!sound.exists(soundAlias))
            sound.add(soundAlias, {
                url: student.bgm,
                loop: true,
                volume: 0.02
            })
        bgmNames.push(soundAlias);
    }
    for (let i = 0; i < 4; i++) {
        let student = randomStudents[Math.floor(Math.random() * randomStudents.length)];
        let pathname = window.location.pathname;
        if (!pathname.endsWith('/')) 
            pathname += '/';
        student.skel = pathname + student.skel;
        student.atlas = pathname + student.atlas;
        student.bgm = pathname + student.bgm;
        randomStudents = randomStudents.filter(s => s.name !== student.name);
        PIXI.Assets.add({ alias: student.name + '_skeleton', src: student.skel });
        PIXI.Assets.add({ alias: student.name + '_atlas', src: student.atlas });
        await PIXI.Assets.load([student.name + '_skeleton', student.name + '_atlas']);
        studentsL2Ds.push({
            ...student,
            spine: pixiSpine.Spine.from({
                skeleton: student.name + '_skeleton',
                atlas: student.name + '_atlas',
            })
        })
        let soundAlias = student.bgm.split('/').pop().split('.')[0];
        if (!sound.exists(soundAlias));
            sound.add(soundAlias, {
                url: student.bgm,
                loop: true,
                volume: 0.02
            })
        bgmNames.push(soundAlias);
    }
    window.l2d_complete = true;
})()
