<template>
  <div ref="barChart" :style="{ height: height, width: width }"></div>
</template>

<script>
import echarts from "echarts";
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
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          top: "0",
          right: "2%",
          bottom: "10%",
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
          axisLine: {
            show: true, //是否显示
            lineStyle: {
              color: "#999", //x轴颜色
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#ededed", //y轴参考线颜色
              type: "dashed", //y轴虚线。可选'solid' 'dashed' 'dotted'
            },
          },
        },
        color: ["#0052d9", "#b5c7ff"],
        yAxis: {
          type: "category",
          axisLine: {
            show: true, //是否显示
            lineStyle: {
              color: "#999", //x轴颜色
            },
          },
          axisLabel: {
            align: "left",
            width: 100,
            margin: 40,
            color: "#666",
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
