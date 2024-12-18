<script setup>
import { ref } from 'vue'

const prop = defineProps(['percent'])

const imgUrl = ref('./img/arona_avatar_2.png')
const imgList = [
  './img/arona_avatar_1.png',
  './img/arona_avatar_2.png',
  './img/arona_avatar_3.png',
  './img/arona_avatar_4.png'
]

document.oncontextmenu = function () {
  return false
}
const options = {
  duration: 2000,
  fill: 'forwards',
  easing: 'ease-in-out'
}
let a = 0
imgUrl.value = imgList[a % 4]
a++
setInterval(() => {
  imgUrl.value = imgList[a % 4]
  a++
}, 2000)
</script>

<template>
  <div class="loading_wrapper">
    <div ref="loadingImg" class="avatar_img bounce-top">
      <img class="loading" :src="imgUrl" alt="" />
      <div class="hide">
        <img :src="imgList[0]" alt="" />
        <img :src="imgList[1]" alt="" />
        <img :src="imgList[2]" alt="" />
        <img :src="imgList[3]" alt="" />
        <video autoplay src="/transfrom.webm"></video>
        <img src="/shitim/Tran_Shitim_Icon.png" alt="" />
      </div>
    </div>
    <div class="progress_wrapper">
      <h1 class="title">connecting...</h1>
      <div class="percent">{{ Math.floor(prop.percent * 100) + '%' }}</div>
    </div>
  </div>
</template>

<style scoped>
@keyframes move {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-1.6666666667rem);
  }
  100% {
    transform: translateY(0);
  }
}

.loading {
  animation: move 2s ease-in-out infinite;
}

img {
  user-select: none;
  -webkit-user-drag: none;
}

@font-face {
  font-family: TVPS-Vain-Capital-2;
  src: url(@/assets/font/TVPS-Vain-Capital-2.ttf);
}

.loading_wrapper {
  background: url('$/img/loading_bg_pc.png')
    center;
  background-size: cover;
  overflow: hidden;
  z-index: 99;
}

.loading_wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.progress_wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.progress_wrapper .title {
  font-family: TVPS-Vain-Capital-2, system-ui;
  color: #1289f9;
  font-size: 1.8rem;
}

.progress_wrapper .percent {
  margin-top: 0.3666666667rem;
  font-size: 1.4rem;
  font-family: TVPS-Vain-Capital-2, system-ui;
  color: #1289f9;
}

.hide {
  opacity: 0;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
}

.avatar_img {
  height: 340px;
}
</style>
