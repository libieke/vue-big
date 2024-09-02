<template>
  <div ref="barChart" :style="{ height: height, width: width }"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    chartOptions: {
      type: Object,
      default: () => {},
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
  },
  mounted() {
    this.initEcharts();
  },
  watch: {
    chartOptions: {
      handler(newVal, oldVal) {
        this.initEcharts();
      },
      // 这里的deep是深度监听，因为我们传递过来的是一个对象
      deep: true,
    },
  },
  methods: {
    initEcharts() {
      var myChart = echarts.init(this.$refs.barChart);
      // 指定图表的配置项和数据
      var option = {
        // backgroundColor: "rgba(32, 124, 219, 0.1)",
        title: {
          text: this.chartOptions.title,
          x: 5,
          top: 0,
          textStyle: {
            fontWeight: "500",
            fontSize: 24,
            color: "#FFFFFF",
          },
        },
        tooltip: {
          show: true,
          borderWidth: 1,
          extraCssText: "box-shadow: 0 0 5px rgba(0, 0, 0, 1)",
          axisPointer: {
            type: "shadow",
            label: {
              show: true,
            },
          },
        },
        grid: {
          left: -35,
          top: "15%",
          bottom: 20,
          right: 10,
          containLabel: true,
        },
        xAxis: {
          // type: "category",
          axisLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#5c6076",
            },
          },
          axisTick: {
            show: false,
          },
        },
        color: ["#0052d9", "#b5c7ff"],
        yAxis: {
          type: "value",
          axisLine: {
            show: false, //是否显示
          },
          axisLabel: {
            align: "left",
            width: 100,
            margin: 50,
            color: "#fff",
          },
          data: this.chartOptions.yData,
        },
        series: [
          {
            type: "bar",
            name: "linedemo",
            tooltip:{
                show:true
            },
            animation:false,
            barWidth:40,
            hoverAnimation:false,
            data: this.chartOptions.xData,
          },
          {
            type: "line",
            name: "距离",
            smooth: true,
            hoverAnimation: false,
            data: this.chartOptions.xData,
            lineStyle: {
              normal: {
                width: 1,
                color: "#fff",
                opacity: 1,
              },
            },
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
  },
};
</script>
