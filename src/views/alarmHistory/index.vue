<template>
  <div class="color">报警历史

    <div @click="showMore">点击</div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    headerComponent
  },
  mounted() {
    this.bodyScale();
    // 监听页面的窗口的变化，每次窗口变化调用等比例缩放方法
    window.addEventListener("resize", this.bodyScale, false);
  },
  methods: {
    // 页面等比例缩放的方法
    bodyScale() {
      //获取当前分辨率下的可是区域宽度
      var deviceWidth = document.documentElement.clientWidth;
       // 分母——设计稿的尺寸
      var scale = deviceWidth / 1920;
       //放大缩小相应倍数
      document.documentElement.style.zoom = scale;
    }
  }
}
</script>

<style lang="scss" scoped>
.color {
  color: #fff;
}
</style>
