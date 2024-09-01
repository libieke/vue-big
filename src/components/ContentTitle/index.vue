<template>
  <div class="padding-left-40 padding-right-40">
    <h2 class="font-14">{{ title }}</h2>
    <div class="bg-white"><slot /></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
      default: "",
    },
    padding: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.font-14 {
  margin: 0;
  // height: 10px;
  color: transparent;
  font-family: Nunito Sans, serif;
  font-size: 14px;
}
.bg-white {
  // padding: 0 40px;
  min-height: calc(100vh - 90px);
  overflow: hidden;
}
</style>
