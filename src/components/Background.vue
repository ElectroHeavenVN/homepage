<script setup>
import * as PIXI from 'pixi.js'
import { studentsL2Ds, bgmNames } from '@/main'
import { sound } from '@pixi/sound'

const props = defineProps(['l2dOnly'])

let animation, id = 0

const l2d = new PIXI.Application()
await l2d.init({
  width: 1920,
  height: 1440,
  backgroundAlpha: 0
})

document.querySelector('#background').appendChild(l2d.canvas)

const emit = defineEmits(['update:changeL2D'])

const changeL2D = (value) => {
  emit('update:changeL2D', value)
}

const setL2D = (num) => {
  sound.stopAll()
  l2d.stage.removeChildren();
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
  let student = studentsL2Ds[id];
  console.log(student)
  animation = student.spine
  l2d.stage.addChild(animation)
  animation.scale.set(student.scale)
  animation.state.timeScale = .5
  animation.autoUpdate = true
  animation.x = student.x
  animation.y = student.y
  let startIdle = 'Start_Idle_01';
  if (!animation.state.data.skeletonData.findAnimation('Start_Idle_01'))
    startIdle = 'Start_idle_01';
  if (animation.state.data.skeletonData.findAnimation(startIdle)) {
    changeL2D(true)
    animation.state.setAnimation(0, startIdle, false)

    let listener = {
      complete: () => {
        changeL2D(false)
        if (animation.state.getCurrent(0).animation.name != "Idle_01" && animation.state.data.skeletonData.findAnimation('Idle_01')) {
          animation.state.setAnimation(0, 'Idle_01', true)
        }
        animation.state.listeners = []
      }
    }
    animation.state.addListener(listener)
  }
  else {
    changeL2D(false)
    if (animation.state.getCurrent(0).animation.name != "Idle_01" && animation.state.data.skeletonData.findAnimation('Idle_01')) {
      animation.state.setAnimation(0, 'Idle_01', true)
    }
  }
  sound.play(bgmNames[id])
}

const skipStartIdle = () => {
  if (animation.state.getCurrent(0).animation.name != "Idle_01" && animation.state.data.skeletonData.findAnimation('Idle_01')) {
    changeL2D(false)
    animation.state.setAnimation(0, 'Idle_01', true)
    animation.state.listeners = []
  }
}

setL2D(Math.floor(Math.random() * studentsL2Ds.length))
</script>

<template>
  <div id="change" v-if="!props.l2dOnly">
    <img class="css-cursor-hover-enabled" @click="setL2D('-')" src="/img/arrow.png" alt="" />
    <img class="css-cursor-hover-enabled" @click="setL2D('+')" src="/img/arrow.png" alt="" />
  </div>
  <div v-if="props.l2dOnly" style="color: transparent; position: fixed; top: 0; left: 0; width: 100%; height: 100%;"
    @click="skipStartIdle()"></div>
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
