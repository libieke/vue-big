<template>
  <div class="win-box">
    <div class="top-box">
      <div class="left">
        <div class="left-text">设备状态</div>
        <div class="state">
          <span class="marginR-5">运行</span>
          <span class="svg-container font-10">
            <svg-icon icon-class="greenDots" />
          </span>
        </div>
        <div class="state">
          <span class="marginR-5">停机</span>
          <span class="svg-container font-10">
            <svg-icon icon-class="redDots" />
          </span>
        </div>
        <div class="state">
          <span class="marginR-5">故障</span>
          <span class="svg-container font-10">
            <svg-icon icon-class="yellowDots" />
          </span>
        </div>
      </div>
      <div class="right" @click="showMore">
        <span class="svg-container font-20">
          <svg-icon icon-class="square" />
        </span>
      </div>
    </div>
    <div class="content-box">
      <div class="item-box">
        <div class="top-box">
          <div class="left">
            <div class="left-text">卷取</div>
            <div class="left-text">S9528</div>
            <div class="svg-container font-20" @click="repairHandle">
              <svg-icon icon-class="work" />
            </div>
          </div>
          <div class="right">
            <span class="svg-container font-20">
              <svg-icon icon-class="bigGreenDots" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {},
  methods: {
    // 全展示
    showMore() {},
    // 修理
    repairHandle() {},
  },
  mounted() {},
  components: {},
};
</script>

<style lang="scss" scoped>
.win-box {
  padding: 14px 20px;
}
.marginR-5 {
  margin-right: 5px;
}

.top-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .left {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    color: #fff;

    .left-text {
      font-size: 16px;
      margin-right: 20px;
    }
    .state {
      display: flex;
      align-items: center;
      // justify-content: space-between;
      border: 1px solid #002652;
      border-radius: 4px;
      margin: 0 8px;
      padding: 4px;
      font-size: 14px;
    }
  }
  .right {
    cursor: pointer;
  }
}
.item-box {
  width: 240px;
  height: 230px;
  border: 1px solid #002856;
  border-radius: 6px;
  padding: 12px;
  .top-box {
    padding: 10px;
    border-bottom: 1px solid #fff;
  }
}
</style>
