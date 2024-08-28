<template>
  <div style="height: 100%">
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
  </div>
</template>

<script>
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
    // 展示时间
    nowTime() {
      var d = new Date();
      var _year = d.getFullYear();
      var _month = d.getMonth();
      var _date = d.getDate();
      var _week = d.getDay();
      var _h = d.getHours();
      var _m = d.getMinutes();
      var _s = d.getSeconds();
      var week = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      var y = _year + "-" + (_month + 1) + "-" + _date + "" + "   ";
      var w = week[_week] + "   ";
      var h =
        this.changeNum(_h) +
        ":" +
        this.changeNum(_m) +
        ":" +
        this.changeNum(_s);
      this.NowTime = y + w + h;
    },
    getTime() {
      var _this = this;
      setInterval(function () {
        _this.nowTime();
      }, 1000);
    },
    changeNum(num) {
      return num >= 10 ? num : "0" + num;
    },
  },
};
</script>

<style lang="scss">
.ivu-modal {
  .ivu-modal-content {
    background: #071332;

    .ivu-modal-header {
      border-bottom: 1px solid #1a3c58;

      .ivu-modal-header-inner {
        color: #75deef;
      }
    }
  }
}

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

  &-title {
    color: #75deef;
    font-size: 30px;
    padding-bottom: 10px;
  }

  .selectRange {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 33%;
    height: 100%;

    .ivu-menu-horizontal {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      background: #03044a;

      &::after {
        height: 0;
      }

      .ivu-menu-item-active {
        // border-bottom: 2px solid #264e5e;
        background-color: #264e5e;
      }

      .ivu-menu-item,
      .ivu-menu-submenu {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #d5f3f9;
        margin: 0 20px;
        height: 40px;
        width: 120px;
        background-color: #021d44;
        &:hover {
          // border-bottom: 2px solid #264e5e;
          background-color: #264e5e;
        }
      }

      .ivu-select-dropdown {
        background: #09102e;

        .ivu-menu-item {
          color: #75deef;
          &:hover {
            // border-bottom: 2px solid #264e5e;
            // background-color: rgba(255, 255, 255, 0);
            background-color: #264e5e;
          }
        }
      }

      .ivu-menu-submenu-title {
        i {
          margin-right: 0;
        }

        .ivu-icon-ios-arrow-down {
          display: none;
        }
      }
    }
  }
}
</style>
