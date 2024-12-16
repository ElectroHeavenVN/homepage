<script setup>
import { Spine } from 'pixi-spine'
import * as PIXI from 'pixi.js'
import { studentsL2Ds, bgmNames } from '@/main'
import { sound } from '@pixi/sound'

const props = defineProps(['l2dOnly'])

let animation, id = 0

const l2d = new PIXI.Application({
  width: 1920,
  height: 1440,
  backgroundAlpha: 0
})

document.querySelector('#background').appendChild(l2d.view)

const emit = defineEmits(['update:switchL2D'])

const changeL2D = (value) => {
  emit('update:changeL2D', value)
}

const setL2D = (num) => {
  sound.stopAll()
  l2d.stage.removeChild(animation)
  switch (num) {
    case '-':
      id = id === 0 ? studentsL2Ds.length - 1 : id - 1
      break
    case '+':
      id = id === studentsL2Ds.length - 1 ? 0 : id + 1
      break
    default:
      id = num
  }
  console.log(studentsL2Ds[id])
  animation = new Spine(studentsL2Ds[id].l2d.spineData)
  l2d.stage.addChild(animation)
  if (animation.state.hasAnimation('Start_Idle_01'))
  {
    changeL2D(true)
    animation.scale.set(studentsL2Ds[id].scale)
    animation.state.setAnimation(0, 'Start_Idle_01', false)
    animation.state.timeScale = 1
    animation.autoUpdate = true
    animation.x = studentsL2Ds[id].x 
    animation.y = studentsL2Ds[id].y

    let listener = {
      complete: () => {
        animation.state.setAnimation(0, 'Idle_01', true)
        changeL2D(false)
        animation.state.removeListener(listener)
      }
    }
    animation.state.addListener(listener)
  }
  else {
    changeL2D(false)
    if (animation.state.hasAnimation('Idle_01')) {
      animation.scale.set(studentsL2Ds[id].scale)
      animation.state.setAnimation(0, 'Idle_01', true)
      animation.state.timeScale = 1
      animation.autoUpdate = true
      animation.x = studentsL2Ds[id].x 
      animation.y = studentsL2Ds[id].y
    }
  }
  sound.play(bgmNames[id])
}

setL2D(id)
</script>

<template>
  <div id="change" v-if="!props.l2dOnly">
    <img class="css-cursor-hover-enabled" @click="setL2D('-')" src="/l2d/arrow.png" alt="" />
    <img class="css-cursor-hover-enabled" @click="setL2D('+')" src="/l2d/arrow.png" alt="" />
  </div>
</template>

<style scoped>
#change {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

img {
  width: 32px;
  height: auto;
  animation: move 2s ease-in-out infinite;
  z-index: 9;
}

img:last-child {
  transform: rotate(180deg);
  animation: moveReverse 2s ease-in-out infinite;
}

@keyframes move {
  0% {
    transform: translateX(10px);
  }
  50% {
    transform: translateX(30px);
  }
  100% {
    transform: translateX(10px);
  }
}

@keyframes moveReverse {
  0% {
    transform: rotate(180deg) translateX(10px);
  }
  50% {
    transform: rotate(180deg) translateX(30px);
  }
  100% {
    transform: rotate(180deg) translateX(10px);
  }
}
</style>
