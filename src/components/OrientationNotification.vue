<template>
  <div v-if="isPortrait" style="color: white; width: 100%; height: 100%;"></div>
  <div v-if="isPortrait" class="rotate-notification">
    Vui lòng xoay ngang màn hình của bạn.
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPortrait: false,
    };
  },
  mounted() {
    window.addEventListener('resize', this.checkOrientation);
    this.checkOrientation();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkOrientation);
  },
  methods: {
    checkOrientation() {
      this.isPortrait = window.innerHeight > window.innerWidth;
    },
  },
};
</script>

<style scoped>
.rotate-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  z-index: 1000;
}
</style>