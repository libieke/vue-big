<template>
  <!-- <div
    style="height: 100%; height: 100%; background: #00102a"
    class="unselectable-text"
  > -->
  <v-scale-screen
    width="1920"
    height="1080"
    style="margin-bottom: 10px"
    :fullScreen="false"
  >
    <div class="header-top">
      <div class="top-time">{{ NowTime }}</div>
      <div class="header">
        <div class="selectRange">
          <Menu
            mode="horizontal"
            @on-select="(name) => $route.name !== name && $router.push(name)"
            v-if="$route.name"
            :active-name="$route.name"
          >
            <MenuItem class="menu-item" name="operationAtatus">
              运行状况
            </MenuItem>
            <MenuItem name="productionInformation"> 生产信息 </MenuItem>
            <MenuItem name="productAnalysis"> 生产分析 </MenuItem>
          </Menu>
        </div>
        <!-- <div class="header-title">nichicon IOT SYSTEM</div> -->
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
    <!-- </div> -->
  </v-scale-screen>
</template>

<script>
import { parseTime } from "@/utils";

export default {
  name: "home",
  data() {
    return {
      NowTime: "",
    };
  },
  mounted() {
    this.getTime();
  },
  methods: {
    getTime() {
      this.NowTime = parseTime(new Date());
      setTimeout(() => {
        this.getTime();
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";
.header-top {
  height: 90px;
  background: url("../assets/images/header.png") no-repeat;
  background-size: cover;
  z-index: 999;
}

.top-time {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 18px;
  color: #dbfaff;
  padding: 2px 31px;
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
