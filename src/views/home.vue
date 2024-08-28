<template>
  <div style="height: 100%; background: #00102a">
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
        <!-- <el-menu
          mode="horizontal"
          @on-select="(name) => $route.name !== name && $router.push(name)"
          :active-name="$route.name"
        >
          <el-menu-item class="menu-item" name="operationAtatus">
            运行状况
          </el-menu-item>
          <el-menu-item name="productionInformation"> 生产信息 </el-menu-item>
          <el-menu-item name="productAnalysis"> 生产分析 </el-menu-item>
        </el-menu>
      </div>
      <div class="header-title">nichicon IOT SYSTEM</div>
      <div class="selectRange">
        <el-menu
          mode="horizontal"
          @on-select="(name) => $route.name !== name && $router.push(name)"
          :active-name="$route.name"
        >
          <el-menu-item name="alarmHistory"> 报警历史 </el-menu-item>
          <el-menu-item name="alarmAnalysis"> 报警分析 </el-menu-item>
          <el-menu-item name="maintainSettings"> 维护设置 </el-menu-item>
        </el-menu>
      </div> -->
      </div>
    </div>
    <div class="page">
      <router-view></router-view>
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
    console.log("this.router :>> ", this.$route);
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
    width: 33%;
    height: 100%;
    color: #fff;

    // .menu-item {
    // }
  }
}
</style>
