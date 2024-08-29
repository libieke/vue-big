<template>
    <div :style="styleObject" class="scale-box">
      <slot />
    </div>
  </template>
   
  <script>
  import debounce from 'lodash.debounce'
  export default {
    components: {},
    props: {
      width: {
        type: Number,
        default: 1920
      },
      height: {
        type: Number,
        default: 1080
      }
    },
    data() {
      return {
        scale: this.getScale()
      }
    },
    computed: {
      styleObject() {
        const obj = {
          transform: `scale(${this.scale}) translate(-50%, -50%)`,
          WebkitTransform: `scale(${this.scale}) translate(-50%, -50%)`,
          width: this.width + 'px',
          height: this.height + 'px'
        }
        return obj
      }
    },
    mounted() {
      this.getScale()
      window.addEventListener('resize', this.setScale)
    },
    beforeDestroy() {
      window.addEventListener('resize', this.setScale)
    },
    methods: {
      getScale() {
        // 固定好16:9的宽高比，计算出最合适的缩放比，宽高比可根据需要自行更改
        console.log(window.innerWidth, 'window.innerWidth')
        const ww = window.innerWidth / this.width
        const wh = window.innerHeight / this.height
        return ww < wh ? ww : wh
      },
      setScale: debounce(function() {
        // 获取到缩放比，设置它
        const scale = this.getScale()
        this.scale = scale
      }, 500)
    }
  }
  </script>
   
    <style scoped lang="scss">
    .scale-box {
      transform-origin: 0 0;
      position: fixed;
      left: 50%;
      top: 50%;
      transition: 0.3s;
    }
    </style>
   