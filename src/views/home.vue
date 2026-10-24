<template>
  <div id="home-container" class="unselectable-text">
    <div class="header-top">
      <div class="top-time">
        <div>实时访问数：{{ number }}</div>
        {{ NowTime }}
      </div>
      <div class="header">
        <div class="selectRange">
          <Menu
            mode="horizontal"
            ref="menus"
            @on-select="(name) => $route.name !== name && $router.push(name)"
            :active-name="$route.name"
          >
            <MenuItem class="menu-item" name="operationAtatus">
              运行状况
            </MenuItem>
            <MenuItem name="productionInformation"> 生产信息 </MenuItem>

            <MenuItem name="productAnalysis"> 生产分析 </MenuItem>
          </Menu>
        </div>
        <!-- <div class="header-title">FACTORY IOT SYSTEM</div> -->
        <div class="selectRange2">
          <Menu
            mode="horizontal"
            @on-select="(name) => $route.name !== name && $router.push(name)"
            :active-name="$route.name"
          >
            <MenuItem name="alarmHistory"> 报警历史 </MenuItem>
            <MenuItem name="alarmAnalysis"> 报警分析 </MenuItem>
            <MenuItem name="maintainSettings"> 维护设置 </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
    <div class="page">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import autofit from "autofit.js";

import { parseTime } from "@/utils";
import { fetchActiveVisitors, umamiEnabled } from "@/utils/umami";

// 实时访问数刷新间隔
const VISITORS_REFRESH_INTERVAL = 30 * 1000;

export default {
  name: "home",
  data() {
    return {
      NowTime: "",
      number: 0,
      visitorsTimer: null,
    };
  },
  mounted() {
    // autofit 大屏自适应：设计稿 1920*1080
    autofit.init({
      dh: 1080,
      dw: 1920,
      el: "#home-container",
      resize: true,
    });
    this.getTime();
    this.getVisitors();
    if (umamiEnabled) {
      this.visitorsTimer = setInterval(
        this.getVisitors,
        VISITORS_REFRESH_INTERVAL
      );
    }
  },
  beforeDestroy() {
    autofit.off("#home-container");
    clearInterval(this.visitorsTimer);
  },
  methods: {
    getTime() {
      this.NowTime = parseTime(new Date());
      setTimeout(() => {
        this.getTime();
      }, 1000);
    },
    async getVisitors() {
      if (!umamiEnabled) return;
      try {
        const count = await fetchActiveVisitors();
        if (typeof count === "number") {
          this.number = count;
        }
      } catch (error) {
        console.warn("获取 Umami 实时访问数失败:", error.message);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

// autofit 需要容器为设计稿固定尺寸，由库负责整体缩放
#home-container {
  width: 1920px;
  height: 1080px;
  background: #00102a;
  overflow: hidden;
}

.header-top {
  height: 90px;
  background: url("../assets/images/header.png") no-repeat;
  background-size: cover;
  z-index: 999;
}

.top-time {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  color: #dbfaff;
  padding: 3px 31px;
}

.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 36px;

  .selectRange {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin-left: -36px;
    color: #fff;

    .ivu-menu-horizontal {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;

      &::after {
        height: 0;
      }

      .ivu-menu-item-active {
        background: url("../assets/images/leftActiv.png") !important;
      }

      .ivu-menu-item,
      .ivu-menu-submenu {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 232px;
        height: 46px;
        margin: 0 -10px;
        color: #fff;
        background: url("../assets/images/left.png");

        &:hover {
          background: url("../assets/images/leftActiv.png");
        }
      }

      .ivu-menu-item2 {
        background: url("../assets/images/right.png");
      }
    }
  }

  .selectRange2 {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #fff;

    .ivu-menu-horizontal {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;

      &::after {
        height: 0;
      }

      .ivu-menu-item-active {
        background: url("../assets/images/rightActive.png") !important;
      }

      .ivu-menu-item,
      .ivu-menu-submenu {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 232px;
        height: 46px;
        margin: 0 -10px;
        color: #fff;
        background: url("../assets/images/right.png");

        &:hover {
          background: url("../assets/images/rightActive.png");
        }
      }
    }
  }
}
</style>
