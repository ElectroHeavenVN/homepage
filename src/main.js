import './assets/index.css'
import '@arco-design/web-vue/dist/arco.css'

import { createApp } from 'vue'
import { Modal } from '@arco-design/web-vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

// console.log(css.family, css.weight);
// console.log(css2.family, css2.weight);

const app = createApp(App)
app.use(ArcoVue)
app.use(ArcoVueIcon)

app.mount('#app')

if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    onNeedRefresh() {
      Modal.open({
        title: 'Thông báo',
        content: 'Sensei, trang web đã được cập nhật, hãy làm mới để truy cập nội dung mới nhất!',
        onOk: () => {
          updateSW(true)
        }
      })
    }
  })
}

window.l2d_complete = false

setInterval(() => {
  document.querySelectorAll('a[href]:not(.tag)').forEach((link) => {
    link.classList.add('tag')
    link.addEventListener('click', async (e) => {
      const url = link.getAttribute('href')
      e.preventDefault()
      document.querySelector('#curtain').style.display = 'block'
      setTimeout(() => {
        let a = document.createElement('a')
        a.href = url
        a.target = '_blank'
        a.click()
      }, 900)
      setTimeout(() => (document.querySelector('#curtain').style.display = ''), 3000)
    })
  })
}, 1000)

import * as PIXI from 'pixi.js'
import { sound } from '@pixi/sound'
import * as pixiSpine from "@esotericsoftware/spine-pixi-v8";

/*——————————————————————————————————————————————————*/
export let studentsL2Ds = []
export let bgmNames = []

;(async function () {
  let students = await fetch('/MemorialLobbies.json');
  students = await students.json();
  let fixedStudents = students.fixed;
  let randomStudents = students.random;
  for (let i = 0; i < fixedStudents.length; i++) {
    let student = fixedStudents[i]
    PIXI.Assets.add({ alias: student.name + '_skeleton', src: student.skel });
    PIXI.Assets.add({ alias: student.name + '_atlas', src: student.atlas });
    await PIXI.Assets.load([student.name + '_skeleton', student.name + '_atlas']);
    studentsL2Ds.push({
      ...student,
      skel: pixiSpine.Spine.from({
        skeleton: student.name + '_skeleton',
        atlas: student.name + '_atlas',
      })
    })
    let soundAlias = student.bgm.split('/').pop().split('.')[0]
    if (!sound.exists(soundAlias))
      sound.add(soundAlias, {
        url: student.bgm,
        loop: true,
        volume: 0.02
      })
    bgmNames.push(soundAlias)
  }
  for (let i = 0; i < 4; i++) {
    let student = randomStudents[Math.floor(Math.random() * randomStudents.length)]
    randomStudents = randomStudents.filter(s => s.name !== student.name)
    PIXI.Assets.add({ alias: student.name + '_skeleton', src: student.skel });
    PIXI.Assets.add({ alias: student.name + '_atlas', src: student.atlas });
    await PIXI.Assets.load([student.name + '_skeleton', student.name + '_atlas']);
    studentsL2Ds.push({
      ...student,
      skel: pixiSpine.Spine.from({
        skeleton: student.name + '_skeleton',
        atlas: student.name + '_atlas',
      })
    })
    let soundAlias = student.bgm.split('/').pop().split('.')[0]
    if (!sound.exists(soundAlias))
      sound.add(soundAlias, {
        url: student.bgm,
        loop: true,
        volume: 0.02
      })
    bgmNames.push(soundAlias)
  }
  window.l2d_complete = true
})()
