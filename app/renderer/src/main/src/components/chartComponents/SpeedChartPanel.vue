<template>
  <div :id="id" class="w-full h-full m-0 p-0" ref="chart"></div>

</template>

<script>
import * as echarts from 'echarts/core';
import {
  GaugeChart
} from 'echarts/charts';
import {
  CanvasRenderer
} from 'echarts/renderers';

echarts.use(
    [GaugeChart, CanvasRenderer]
);

export default {
  name: "SpeedChartPanel",
  props: ['id','percent'],
  data() {
    return {
      option: {
        series: [{
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          radius:"100%",
          axisLine: {
            lineStyle: {
              width: 30,
              color: [
                [0.3, '#67e0e3'],
                [0.7, '#37a2da'],
                [1, '#fd666d']
              ]
            }
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            length: 8,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          splitLine: {
            distance: -30,
            length: 30,
            lineStyle: {
              color: '#fff',
              width: 4
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 35,
            fontSize: 8
          },
          detail: {
            valueAnimation: true,
            formatter: '{value}%',
            fontSize: 10,
            color: 'auto'
          },
          data: [{
            value: -1,
          }]
        }]
      },
      myChart: null
    }
  },
  created() {
    const that = this;
    that.option.series[0].data[0].value = this.percent
  },
  beforeDestroy() {
    if (this.myChart != null && this.myChart !== "" && typeof this.myChart !== undefined) {
      this.myChart.dispose();// 销毁
      this.myChart = null;
    }
  },
  watch: {
    option: {// 深度监听，可监听到对象、数组的变化
      handler(val) {
        // debugger
        if (this.myChart === null) {
          const chartDom = document.getElementById(this.id);
          this.myChart = echarts.init(chartDom);
          let self = this;
          window.addEventListener('resize', function() {
            self.myChart.resize();
          })
        }
        this.myChart.setOption(this.option, true);
      },
      deep: true // true 深度监听
    },
    percent:{
      handler(val) {
        // debugger
        if (this.myChart !== null) {
          this.option.series[0].data[0].value = val
        }
      },
      deep: true // true 深度监听
    }
  }
}
</script>

<style scoped>

</style>
<style>
canvas {
  /*width: 100%!important;*/
}
</style>
