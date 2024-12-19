<script setup>
import { Modal } from '@arco-design/web-vue'
import { h, ref } from 'vue'
import config from '/config.json'
const emit = defineEmits(['switch'])
const props = defineProps(['l2dOnly'])

const max_ap = 60 + config.level * 2
const ap = ref(
  max_ap -
    Math.trunc(
      max_ap *
        ((new Date().getTime() -
          new Date(
            `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()} 00:00:00`
          )) /
          86400000)
    )
)

let pathname = window.location.pathname;
if (!pathname.endsWith('/')) 
    pathname += '/';

const img = ref(pathname + 'img/max.png')
const showMin = ref(false)
const hover = ref(window.matchMedia('(hover: none)').matches)

const about = () => {
  Modal.open({
    title: 'Về trang này',
    content: () => [
      h(
        'p',
        {},
        config.author === '小鱼yuzifu'
          ? `© ${new Date().getFullYear()} 小鱼yuzifu`
          : [`© ${new Date().getFullYear()} ${config.author}`, h('p', {}, 'Made by 小鱼yuzifu')]
      ),
      h('span', {}, 'Suộc code: '),
      h('a', { href: 'https://github.com/sf-yuzifu/homepage', target: '_blank' }, 'Github'),
    ],
    footer: false
  })
}

const change = () => {
  img.value = pathname + (img.value.endsWith('img/min.png') ? 'img/max.png' : 'img/min.png');
  emit('switch')
}

let l2dHoldTimeout;

const l2dHold = () => 
{
  l2dHoldTimeout = setTimeout(() => 
  {
    if (document.fullscreenElement) 
      document.exitFullscreen();
    else 
      document.documentElement.requestFullscreen();
      l2dRelease();
  }, 500);
}

const l2dRelease = () => {
  if (l2dHoldTimeout) 
  {
    clearTimeout(l2dHoldTimeout);
    l2dHoldTimeout = null;
  }
}

document.body.addEventListener('click', () => {
  if (props.l2dOnly && hover.value) {
    showMin.value = !showMin.value
  } else {
    showMin.value = true
  }
})

window.matchMedia('(hover: none)').addListener((e) => {
  hover.value = e.matches
})

setInterval(() => {
  ap.value++
}, 60000)
</script>

<template>
  <div class="toolbox-box">
    <div
      class="toolbox"
      :style="{
        transform: (!props.l2dOnly ? 'translateY(0)' : 'translateY(-300px)') + ' skew(-10deg)',
        transition: 'transform 0.3s ' + (!props.l2dOnly ? 'ease-out' : 'ease-in')
      }"
    >
      <img src="/img/ap.png" alt="" />
      <span>{{ ap + '/' + max_ap }}</span>
    </div>
    <div
      class="toolbox"
      :style="{
        transform: (!props.l2dOnly ? 'translateY(0)' : 'translateY(-300px)') + ' skew(-10deg)',
        transition: 'transform 0.3s ' + (!props.l2dOnly ? 'ease-out' : 'ease-in')
      }"
    >
      <img src="/img/gold.png" alt="" />
      <span>53,102,982</span>
    </div>
    <div
      class="toolbox"
      :style="{
        transform: (!props.l2dOnly ? 'translateY(0)' : 'translateY(-300px)') + ' skew(-10deg)',
        transition: 'transform 0.3s ' + (!props.l2dOnly ? 'ease-out' : 'ease-in')
      }"
    >
      <img src="/img/pyroxene.png" alt="" />
      <span>49,658</span>
    </div>
    <a
      class="about toolbox"
      @click="about"
      :style="{
        transform: (!props.l2dOnly ? 'translateY(0)' : 'translateY(-300px)') + ' skew(-10deg)',
        transition: 'transform 0.3s ' + (!props.l2dOnly ? 'ease-out' : 'ease-in')
      }"
    >
      <icon-info-circle class="css-cursor-hover-enabled" />
    </a>
    <a 
    class="toolbox github"
    :style="{
        transform: (!props.l2dOnly ? 'translateY(0)' : 'translateY(-300px)') + ' skew(-10deg)',
        transition: 'transform 0.3s ' + (!props.l2dOnly ? 'ease-out' : 'ease-in')
      }"
    href="https://github.com/ElectroHeavenVN/homepage/"
    >
      <img src="/icon/github.svg" alt="GitHub Repository" />
    </a>
    <a
      class="l2d toolbox"
      :class="{ canHover: !hover }"
      @click="change"
      @mousedown="l2dHold"
      @touchstart="l2dHold"
      @mouseRelease="l2dRelease"
      @mouseup="l2dRelease"
      @touchend="l2dRelease"
      :style="{
        transform: (!props.l2dOnly ? 'translateY(0)' : 'translateY(-76px)') + ' skew(-10deg)',
        transition: 'transform 0.3s ' + (!props.l2dOnly ? 'ease-out' : 'ease-in') + ',opacity 0.6s',
        opacity: !props.l2dOnly || (showMin && hover) ? 1 : 0
      }"
    >
      <img alt="" :src="img" style="pointer-events:none;"/>
    </a>
  </div>
</template>

<style scoped>
.toolbox-box {
  position: absolute;
  right: 20px;
  top: 40px;
  display: inline-flex;
}

.toolbox-box .toolbox {
  width: 220px;
  height: 56px;
  background: #fffd;
  color: #003153;
  margin: 0 10px;
  transform: skew(-10deg);
  border-radius: 6px;
  filter: drop-shadow(0px 0px 3px #0003);
  transition:
    background-color 0.3s,
    transform 0.1s;
  display: flex;
  align-items: center;
}

.toolbox img {
  height: 70%;
  transform: skew(10deg);
  margin: 0 8px 0 10px;
}
.toolbox span {
  font-size: 26px;
  transform: skew(10deg);
}

.toolbox-box .toolbox.about,
.toolbox-box .toolbox.l2d,
.toolbox-box .toolbox.github {
  width: 80px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.toolbox-box .toolbox.l2d,
.toolbox-box .toolbox.github {
  position: absolute;
  right: 0;
  top: 76px;
  overflow: hidden;
}

.toolbox-box .toolbox.github {
  right: 100px;
}

.toolbox.l2d img,
.toolbox.github img {
  filter: drop-shadow(-100vw 0px 0px #003153);
  transform: translateX(100vw);
  height: 32px;
}

.toolbox.github img {
  transform: skew(10deg);
}

.toolbox-box .toolbox:hover {
  background: #fffe;
}

.toolbox-box .toolbox.about:active,
.toolbox-box .toolbox.l2d:active,
.toolbox-box .toolbox.github:active {
  transform: skew(-10deg) scale(0.9);
}

.arco-icon {
  font-size: 32px;
  transform: skew(10deg);
}

@media screen and (max-width: 480px) {
  .toolbox:not(.about) {
    display: none;
  }
  
  a.toolbox.github {
    display: none !important;
  }
}

.toolbox-box .toolbox.l2d.canHover:hover {
  opacity: 1 !important;
}
</style>
