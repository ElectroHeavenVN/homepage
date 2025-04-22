<script setup>
import * as PIXI from 'pixi.js';
import { memorialLobbies, bgmNames } from '@/main';
import { sound } from '@pixi/sound';
import {Howl, Howler} from 'howler';

const props = defineProps(['l2dOnly'])

let animation, id = 0;
let soundList = [];
let talking = false, talkIndex = 1;
let canSkip = true;

const l2d = new PIXI.Application()
await l2d.init({
  width: 1920,
  height: 1440,
  backgroundAlpha: 0
})

document.querySelector('#background').appendChild(l2d.canvas);

const emit = defineEmits(['update:changeL2D']);

const onEvent = (entry, event) => {
  if (event.stringValue == '')
    return;
  console.log(event.stringValue);
  let pathname = window.location.pathname;
  if (!pathname.endsWith('/')) 
      pathname += '/';
  let voice = new Howl({
      src: [pathname + memorialLobbies[id].path + event.stringValue + '.ogg'],
      volume: 0.3,
      onend: () => {
          talking = false;
      }
  });
  if (voice.state() == 'loaded')
      voice.play();
  else if (voice.state() == 'loading') {
      voice.on('load', () => {
          voice.play();
      })
  }
  soundList.push(voice);
}

const changeL2D = (value) => {
  emit('update:changeL2D', value);
}

const setL2D = (num) => {
  canSkip = true;
  talking = false;
  talkIndex = 1;
  sound.stopAll();
  if (soundList.length != 0) {
    for (var i in soundList) 
      soundList[i].stop();
    soundList = [];
  }  
  if (animation) {
    animation.state.setEmptyAnimation(1);
    animation.state.setEmptyAnimation(2);
  }
  l2d.stage.removeChildren();
  switch (num) {
    case '-':
      id = id === 0 ? memorialLobbies.length - 1 : id - 1;
      break
    case '+':
      id = id === memorialLobbies.length - 1 ? 0 : id + 1;
      break
    default:
      id = num;
  }
  let student = memorialLobbies[id];
  console.log(student);
  animation = student.spine;
  l2d.stage.addChild(animation);
  animation.scale.set(student.scale);
  animation.x = student.x;
  animation.y = student.y;
  let startIdle = 'Start_Idle_01';
  if (!animation.state.data.skeletonData.findAnimation('Start_Idle_01'))  //Special case for Hoshino_Armed
    startIdle = 'Start_idle_01';
  animation.state.addListener({
    event: onEvent
  });
  if (animation.state.data.skeletonData.findAnimation(startIdle)) {
    changeL2D(true);
    animation.state.setAnimation(0, startIdle, false);

    let listener = {
      complete: () => {
        changeL2D(false);
        if (animation.state.getCurrent(0).animation.name != "Idle_01" && animation.state.data.skeletonData.findAnimation('Idle_01')) {
          animation.state.setAnimation(0, 'Idle_01', true);
        }
        animation.state.listeners = [];
        animation.state.addListener({
          event: onEvent
        });
        canSkip = false;
      }
    }
    animation.state.addListener(listener);
  }
  else {
    changeL2D(false);
    if (animation.state.getCurrent(0).animation.name != "Idle_01" && animation.state.data.skeletonData.findAnimation('Idle_01')) {
      animation.state.setAnimation(0, 'Idle_01', true);
      animation.state.listeners = [];
      animation.state.addListener({
        event: onEvent
      });
      canSkip = false;
    }
  }
  sound.play(bgmNames[id]);
}

const skipStartIdle = () => {
  if (animation.state.getCurrent(0).animation.name != "Idle_01" && animation.state.data.skeletonData.findAnimation('Idle_01')) {
    changeL2D(false);
    if (soundList.length != 0) {
      for (var i in soundList) 
        soundList[i].stop();
      soundList = [];
    }
    animation.state.setEmptyAnimation(1);
    animation.state.setEmptyAnimation(2);
    animation.state.setAnimation(0, 'Idle_01', true);
    animation.state.listeners = [];
    animation.state.addListener({
      event: onEvent
    });
    canSkip = false;
  }
}

const onInteractionWithStudent = () => {
  if (talking || animation.state.getCurrent(0).animation.name.toLowerCase().startsWith('start_idle')) 
    return;
  console.log('Talk_0' + talkIndex);
  animation.state.addAnimation(1, 'Talk_0' + talkIndex + '_A');
  animation.state.addAnimation(2, 'Talk_0' + talkIndex + '_M');
  talkIndex++;
  if (!animation.state.data.skeletonData.findAnimation('Talk_0' + talkIndex + '_A')) 
    talkIndex = 1;
  talking = true;
}

//There are some problem with Sakurako_Idol which I didn't know how to fix yet
// let sakurakoIdolIndex = memorialLobbies.findIndex(s => s.name === 'Sakurako_Idol');
// if (sakurakoIdolIndex !== -1) 
//   setL2D(sakurakoIdolIndex);
// else
  setL2D(Math.floor(Math.random() * memorialLobbies.length));
</script>

<template>
  <div id="change" v-if="!props.l2dOnly">
    <img class="css-cursor-hover-enabled" @click="setL2D('-')" src="/img/arrow.png" alt="" />
    <img class="css-cursor-hover-enabled" @click="setL2D('+')" src="/img/arrow.png" alt="" />
  </div>
  <div class="interaction css-cursor-hover-enabled" @click="onInteractionWithStudent()"></div>
  <div v-if="props.l2dOnly && canSkip" style="position: fixed; width: 100%; height: 100%;" @click="skipStartIdle()"></div>
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

.interaction {
  position: fixed; 
  top: 17%;
  left: 17%;
  width: 66%;
  height: 66%;
  cursor: pointer;
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
