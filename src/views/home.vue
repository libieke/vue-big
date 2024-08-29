<template>
  <div style="height: 100%; background: #00102a" class="unselectable-text">
    <div class="top-time">{{ NowTime }}</div>
    <div class="header">
      <div class="selectRange">
        <Menu
          mode="horizontal"
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
      <div class="header-title">nichicon IOT SYSTEM</div>
      <div class="selectRange">
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
    <div class="page">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { parseTime } from "@/utils";

export default {
  name: "",
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
.top-time {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 24px;
  font-size: 12px;
  color: #bbd8de;
  padding: 0 20px;
  background-color: #09161a;
}

.header {
  height: 60px;
  background: #03044a;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  .header-title {
    color: #fff;
    font-size: 30px;
    font-weight: 700;
    padding-bottom: 10px;
  }

  .selectRange {
    display: flex;
    justify-content: center;
    align-items: center;
    // width: 33%;
    height: 100%;
    color: #fff;
  }
}

.ivu-menu-horizontal {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  // background-color: pink;

  &::after {
    height: 0;
  }

  .ivu-menu-item-active {
    border-bottom: 2px solid #264e5e;
    background-color: #264e5e;
  }

  .ivu-menu-item,
  .ivu-menu-submenu {
    color: #fff;
    margin: 0 20px;

    &:hover {
      border-bottom: 2px solid #264e5e;
    }
  }
}
</style>
