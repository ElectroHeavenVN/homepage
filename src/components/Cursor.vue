<script setup>
import { ref } from 'vue'

const posX = ref(0)
const posY = ref(0)

document.addEventListener('mousemove', showMousePosition, false)

function showMousePosition(event) {
  posX.value = event.clientX
  posY.value = event.clientY
  document.querySelector('#cursor .inner').style.opacity = 1
}

document.body.onmouseleave = function () {
  document.querySelector('#cursor .inner').style.opacity = 0
}

document.body.onmouseenter = function () {
  document.querySelector('#cursor .inner').style.opacity = 1
}

document.body.onclick = function () {
  let a = document.createElement('div')
  a.classList.add('click')
  a.style.left = posX.value - 50 / 2 + 'px'
  a.style.top = posY.value - 50 / 2 + 'px'

  let b = document.createElement('div')
  let c = Math.random() * 360
  b.style.transform = 'rotate(' + c + 'deg)'
  b.classList.add('inner')
  a.appendChild(b)

  let d = document.createElement('div')
  let e = Math.random() * 360
  d.style.transform = 'rotate(' + e + 'deg)'
  d.classList.add('inner')
  a.appendChild(d)

  document.body.appendChild(a)
  setTimeout(() => {
    b.style.transform = 'rotate(' + (c + 180) + 'deg)'
    d.style.transform = 'rotate(' + (e + 180) + 'deg)'
  }, 1)
  setTimeout(() => {
    a.remove()
  }, 500)
}

document.oncontextmenu = function () {
  return false
}

let el = window.document.body
window.document.body.onmouseover = function (event) {
  el = event.target
  if (
    el.tagName === 'A' ||
    el.tagName === 'BUTTON' ||
    el.classList.contains('css-cursor-hover-enabled') ||
    el.parentElement.classList.contains('css-cursor-hover-enabled') ||
    el.parentElement.parentElement.classList.contains('css-cursor-hover-enabled')
  ) {
    document.querySelector('#cursor').classList.add('hover')
  } else {
    document.querySelector('#cursor').classList.remove('hover')
  }
}
</script>

<template>
  <div
    id="cursor"
    class="cursor"
    :style="{
      transform: `translate(${posX}px, ${posY}px)`
    }"
  >
    <div class="inner"></div>
  </div>
</template>

<style>
.click {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background: #c3ebff;
  position: fixed;
  left: 0;
  top: 0;
  display: grid;
  transform: scale(0%);
  border: 3px solid transparent;
  filter: drop-shadow(0px 0px 6px #c3ebff);
  animation: move 0.45s ease-out;
  pointer-events: none;
  align-items: center;
  justify-items: center;
}

.click .inner {
  width: calc(100% + 1px);
  height: calc(100% + 1px);
  border-top: 3px solid transparent;
  border-right: 3px solid transparent;
  border-left: 3px solid transparent;
  border-bottom: 3px solid transparent;
  border-radius: 100%;
  position: absolute;
  transition: transform 0.5s linear;
  animation: move2 0.5s ease-out;
}

@keyframes move2 {
  0% {
    border-top: 3px solid #77deff;
  }
  25% {
    border-top: 3px solid #fff;
  }
  50% {
    border-top: 3px solid #fff;
  }
  80% {
    border-top: 3px solid transparent;
  }
  100% {
    border-top: 3px solid transparent;
  }
}

@keyframes move {
  0% {
    transform: scale(0%);
    background: #c3ebff;
  }
  25% {
    transform: scale(100%);
    background: #c3ebff66;
  }
  50% {
    transform: scale(100%);
    background: transparent;
  }
  80% {
    transform: scale(100%);
    background: transparent;
  }
  100% {
    transform: scale(100%);
    background: transparent;
  }
}
</style>

<style scoped>
@media (hover: none) {
  #cursor {
    display: none;
  }
}
#cursor {
  pointer-events: none;
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
}

#cursor::after {
  content: '';
  opacity: 0;
  transition: all 0.3s ease;
  background-size: 100%;
  width: 1.3666666667rem;
  height: 1.4666666667rem;
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  transform: translate(-50%, -30%);
}

#cursor.hover::after {
  opacity: 1;
}

#cursor .inner {
  box-shadow: initial !important;
  border-radius: initial !important;
  background-size: 100% !important;
  width: 1.4rem !important;
  height: 1.7rem !important;
  display: inline-block !important;
  transition: all 0.3s ease;
  transform: translate(-0.3rem) !important;
  opacity: 0;
}
</style>
