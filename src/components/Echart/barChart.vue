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
        // backgroundColor: "#0f375f",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            label: {
              show: true,
            },
          },
        },
        grid: {
          top: "10%",
          right: "5%",
          left: "5%",
          bottom: "10%",
        },
        legend: {
          data: ["销售水量", "主营业务"],
          top: "15%",
          textStyle: {
            color: "#ffffff",
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: [0, 0.01],
          axisLine: {
            show: true, //是否显示
            lineStyle: {
              color: "#999", //x轴颜色
            },
          },
        },
        color: ["#0052d9", "#b5c7ff"],
        yAxis: {
          type: "value",
          axisLine: {
            show: true, //是否显示
            lineStyle: {
              color: "#999", //x轴颜色
            },
          },
          axisLabel: {
            align: "left",
            width: 100,
            margin: 60,
            color: "#fff",
          },
          data: this.chartOptions.yData,
        },
        series: [
          {
            type: "bar",
            data: this.chartOptions.xData,
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
