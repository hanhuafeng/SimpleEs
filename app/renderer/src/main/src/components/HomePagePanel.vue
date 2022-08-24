<template>
  <div>
    <div class="text-left mt-3 flex flex-row items-center">
      <div class="h-6 ml-3 mr-2 min-h-6 min-w-6 lg:h-7 xl:h-7 2xl:h-7">
        <img :src="pictureResources.logoElasticSearchColor" class="w-full h-full" alt="">
      </div>
      <div
          class="text-left dark:text-white select-none sm:text-base md:text-xl lg:text-3xl xl:text-3xl 2xl:text-3xl truncate">
        Elasticsearch<a
          v-if="version!=null">{{
          '-' + version
        }}</a>{{
          clusterInfo == null ? '' : clusterInfo.cluster_name == null ? '' : '(' + clusterInfo.cluster_name + ')'
        }}
      </div>
      <div class="rounded-full w-3 h-3  ml-5 mr-1.5"
           :style="{backgroundColor:typeof statusIconColor[statusColor] === 'undefined'
           || statusIconColor[statusColor]==null?statusIconColor['grey']:statusIconColor[statusColor]}"></div>
      <div class="dark:text-white select-none sm:text-xs md:text-sm lg:text-base xl:text-base 2xl:text-base truncate"
           v-if="statusColor!=='gray'">
        运行状况为{{ statusColor }}
      </div>
      <div class="dark:text-white select-none sm:text-xs md:text-sm lg:text-base xl:text-base 2xl:text-base truncate"
           v-if="statusColor==='gray'">
        ES未连接
      </div>
    </div>
    <!-- 数据小卡片   -->
    <div class="flex flex-row grid grid-cols-4 gap-4 pt-3 px-2.5">
      <base-data-card
          v-for="item in esBaseInfoList"
          :key="item.describe"
          :icon="item.icon"
          :animate="item.animate"
          :num="item.num"
          :describe="item.describe"
          :endDescribe="item.endDescribe"
          :bg-color="item.bgColor"/>
    </div>
    <!--  图表部分  -->
    <div class="flex flex-row grid grid-cols-2 gap-4 pt-3 px-2.5">
      <div class="rounded-2xl bg-white dark:bg-headBlackBg">
        <div class="h-0 md:h-40 sm:h-28 lg:h-48 xl:h-64 2xl:h-64">
          <div class="w-full text-left pl-3.5 pt-3">
            <a class="text-xs truncate sm:text-xs md:text-xm  lg:text-base xl:text-lg 2xl:text-xl dark:text-white">磁盘使用(数据节点)</a>
          </div>
          <speed-chart-panel class="h-full relative" id="DiskPanel" :percent="diskPercent"></speed-chart-panel>
        </div>
      </div>
      <div class="rounded-2xl bg-white dark:bg-headBlackBg">
        <div class="h-0 md:h-40 sm:h-28 lg:h-48 xl:h-64 2xl:h-64">
          <div class="w-full text-left pl-3.5 pt-3">
            <a class="text-xs truncate sm:text-xs md:text-xm  lg:text-base xl:text-lg 2xl:text-xl dark:text-white">平均内存使用</a>
          </div>
          <speed-chart-panel class="h-full relative" id="JvmPanel" :percent="memoryPercent"></speed-chart-panel>
        </div>
      </div>
    </div>
    <!--  集群信息  -->
    <div class="flex flex-row grid grid-cols-1 pt-3 px-2.5">
      <simple-table :headers="tableHeaders" :data="esNodeData"/>
    </div>
  </div>
</template>

<script>
import SharedIcon from '@/assets/pic/shared_icon.png'
import SuccessIcon from '@/assets/pic/success_icon.png'
import BaseDataCard from "@/components/BaseDataCard";
import IndexIcon from '@/assets/pic/index_icon.png'
import TotalSizeIcon from '@/assets/pic/total-size-icon.png'
import LogoElasticSearchColor from '@/assets/pic/logo-elastic-search-24-color.png'
import SpeedChartPanel from "@/components/chartComponents/SpeedChartPanel";
import SimpleTable from "@/components/EsClusterInfoTable";
import bus from '@/handler/communicationHandler/eventBus'
import ElasticsearchResolver732 from '@/handler/functionHandler/ElasticsearchResolver-7.3.2'

export default {
  /**
   * 首页
   */
  name: "HomePagePanel",
  components: {
    BaseDataCard: BaseDataCard,
    SpeedChartPanel: SpeedChartPanel,
    SimpleTable: SimpleTable
  },
  created() {
    this.elasticsearchResolver732 = new ElasticsearchResolver732()
  },
  mounted() {
    const self = this
    bus.$on('init', function () {
      if (self.homePageInterval == null) {
        self.init()
        // self.homePageInterval = setInterval("self.init",5000)
      } else {
        clearTimeout(self.homePageInterval)
        self.init()
        // self.homePageInterval = setInterval("self.init",5000)
      }
    })
    bus.$on('stopAll', function () {
      if (self.homePageInterval != null) {
        clearTimeout(self.homePageInterval)
      }
      self.version = null
      self.statusColor = null
      self.esBaseInfoList = [
        {
          animate: 'shared-animate',
          icon: SharedIcon,
          num: '0',
          describe: '分片总数',
          endDescribe: 'Total Shards',
          bgColor: 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-purple-800 dark:via-green-800 dark:to-gray-800'
        }, {
          // success-animate
          animate: '',
          icon: SuccessIcon,
          num: '0',
          describe: '成功分片数',
          endDescribe: 'Successful Shards',
          bgColor: 'bg-gradient-to-r from-yellow-200 via-red-200 to-blue-500 dark:from-blue-700 dark:via-gray-700 dark:to-yellow-900'
        }, {
          // index-animate
          animate: '',
          icon: IndexIcon,
          num: '0',
          describe: '索引数量',
          endDescribe: 'Indices Num',
          bgColor: 'bg-gradient-to-r from-purple-400 via-green-200 to-red-500 dark:from-pink-800 dark:via-blue-800 dark:to-yellow-800'
        }, {
          // success-animate
          animate: '',
          icon: TotalSizeIcon,
          num: '0Kb',
          describe: '索引占用空间',
          endDescribe: 'Disk Indices',
          bgColor: 'bg-gradient-to-r from-pink-300 via-purple-300 to-blue-400 dark:from-blue-700 dark:via-gray-500 dark:to-blue-800'
        }
      ]
      // table表格中的ES节点信息
      self.esNodeData = []
      // 集群基本信息
      self.clusterInfo = {}
      // 磁盘占用%
      self.diskPercent = 0
      // 内存占用
      self.memoryPercent = 0
      // ES连接信息,
      self.esConnectionInfo = {}
      // 当前页面只能有一个Interval定时器
      self.homePageInterval = null
    })
  },
  data() {
    return {
      pictureResources: {
        sharedIcon: SharedIcon,
        successIcon: SuccessIcon,
        indexIcon: IndexIcon,
        totalSizeIcon: TotalSizeIcon,
        logoElasticSearchColor: LogoElasticSearchColor
      },
      statusColor: 'gray',
      version: null,
      statusIconColor: {
        'red': '#ff0000',
        'green': '#35ff00',
        'yellow': '#ffd500',
        'grey': '#868383'
      },
      esBaseInfoList: [
        {
          animate: 'shared-animate',
          icon: SharedIcon,
          num: '0',
          describe: '分片总数',
          endDescribe: 'Total Shards',
          bgColor: 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-purple-800 dark:via-green-800 dark:to-gray-800'
        }, {
          // success-animate
          animate: '',
          icon: SuccessIcon,
          num: '0',
          describe: '成功分片数',
          endDescribe: 'Successful Shards',
          bgColor: 'bg-gradient-to-r from-yellow-200 via-red-200 to-blue-500 dark:from-blue-700 dark:via-gray-700 dark:to-yellow-900'
        }, {
          // index-animate
          animate: '',
          icon: IndexIcon,
          num: '0',
          describe: '索引数量',
          endDescribe: 'Indices Num',
          bgColor: 'bg-gradient-to-r from-purple-400 via-green-200 to-red-500 dark:from-pink-800 dark:via-blue-800 dark:to-yellow-800'
        }, {
          // success-animate
          animate: '',
          icon: TotalSizeIcon,
          num: '0Kb',
          describe: '索引占用空间',
          endDescribe: 'Disk Indices',
          bgColor: 'bg-gradient-to-r from-pink-300 via-purple-300 to-blue-400 dark:from-blue-700 dark:via-gray-500 dark:to-blue-800'
        }
      ],
      tableHeaders: ['名称', '分片', 'CPU使用', '系统负载', '内存使用情况', '磁盘可用空间'],
      // table表格中的ES节点信息
      esNodeData: [],
      // 集群基本信息
      clusterInfo: {},
      // 磁盘占用%
      diskPercent: 0,
      // 内存占用
      memoryPercent: 0,
      // ES连接信息,
      esConnectionInfo: {},
      // 当前页面只能有一个Interval定时器
      homePageInterval: null
    }
  },
  methods: {
    toThousands(num) {
      num = num.toFixed(2);
      return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },
    /**
     * 初始化方法
     */
    init() {
      let that = this
      // 获取索引信息
      that.elasticsearchResolver732.getAllIndex((indexInfo) => {
        if (indexInfo!=null && typeof indexInfo!='undefined') {
          that.esBaseInfoList[2].num = indexInfo.length + ''
        }
      }, (error) => {
        console.log(error)
      });
      // ES集群信息
      that.elasticsearchResolver732.getEsClusterStatus((clusterInfo) => {
        that.clusterInfo = clusterInfo
        if (clusterInfo == null) {
          return
        }
        if (typeof clusterInfo['status'] != 'undefined' && clusterInfo['status'] != null) {
          that.statusColor = clusterInfo['status']
        }
        if (typeof clusterInfo['active_shards'] != 'undefined'
            && clusterInfo['active_shards'] != null
            && typeof clusterInfo['unassigned_shards'] != 'undefined'
            && clusterInfo['unassigned_shards'] != null) {
          that.esBaseInfoList[0].num = clusterInfo['active_shards'] + clusterInfo['unassigned_shards'] + ''
          that.esBaseInfoList[1].num = clusterInfo['active_shards'] + ''
        }
      }, (error) => {
        console.log(error)
      });
      // Node节点信息
      that.elasticsearchResolver732.getAllocationInfo((data) => {
        let nodeToInfo = {}
        if (data != null && data.length !== 0) {
          that.tranceDiskInfo(data)
          data.forEach((item) => {
            if (item.node != null && typeof item.node != 'undefined') {
              nodeToInfo[item.node] = item
            }
          })
        }
        that.elasticsearchResolver732.getAllNodesInfo((callback) => {
          that.esNodeData = []
          that.tranceMemory(callback)
          if (typeof callback != 'undefined' && callback != null && callback.length !== 0) {
            callback.forEach((item) => {
              let esNodeDataInfo = {
                ip: '-',
                heapPercent: "0",
                ramPercent: "0",
                cpu: "0",
                load_1m: "0",
                load_5m: "0",
                load_15m: "0",
                nodeRole: "",
                master: "-",
                name: "-",
                diskUsed: "0",
                diskAvail: "0",
                diskTotal: "0",
                shards: '0'
              }
              if (typeof item['http'] != 'undefined' && item['http'] != null) {
                esNodeDataInfo.ip = item['http']
              }
              if (typeof item['heap.percent'] != 'undefined' && item['heap.percent'] != null) {
                esNodeDataInfo.heapPercent = item['heap.percent']
              }
              if (typeof item['ram.percent'] != 'undefined' && item['ram.percent'] != null) {
                esNodeDataInfo.ramPercent = item['ram.percent']
              }
              if (typeof item['cpu'] != 'undefined' && item['cpu'] != null) {
                esNodeDataInfo.cpu = item['cpu']
              }
              if (typeof item['load_1m'] != 'undefined' && item['load_1m'] != null) {
                esNodeDataInfo.load_1m = item['load_1m']
              }
              if (typeof item['load_5m'] != 'undefined' && item['load_5m'] != null) {
                esNodeDataInfo.load_5m = item['load_5m']
              }
              if (typeof item['load_15m'] != 'undefined' && item['load_15m'] != null) {
                esNodeDataInfo.load_15m = item['load_15m']
              }
              if (typeof item['node.role'] != 'undefined' && item['node.role'] != null) {
                esNodeDataInfo.nodeRole = item['node.role']
              }
              if (typeof item['master'] != 'undefined' && item['master'] != null) {
                esNodeDataInfo.master = item['master']
              }
              if (typeof item['name'] != 'undefined' && item['name'] != null) {
                esNodeDataInfo.name = item['name']
              }
              if (typeof item['disk.used'] != 'undefined' && item['disk.used'] != null) {
                esNodeDataInfo.diskUsed = item['disk.used'].toUpperCase()
              }
              if (typeof item['disk.avail'] != 'undefined' && item['disk.avail'] != null) {
                esNodeDataInfo.diskAvail = item['disk.avail'].toUpperCase()
              }
              if (typeof item['disk.total'] != 'undefined' && item['disk.total'] != null) {
                esNodeDataInfo.diskTotal = item['disk.total'].toUpperCase()
              }
              if (typeof nodeToInfo[item['name']] != 'undefined'
                  && nodeToInfo[item['name']] != null) {
                if (typeof nodeToInfo[item['name']]['shards'] != 'undefined'
                    && nodeToInfo[item['name']]['shards'] != null) {
                  esNodeDataInfo.shards = nodeToInfo[item['name']]['shards']
                }
              }
              that.esNodeData.push(esNodeDataInfo)
            })
          }
        }, (error) => {
          console.log(error)
        })
      }, (error) => {
        console.log(error)
      })
      that.homePageInterval = setTimeout(that.init, 30000)
    },
    /**
     * 解析磁盘容量图表信息
     * @param callback
     */
    tranceDiskInfo(callback) {
      let totalIndicesUse = 0
      let totalDisk = 0
      let totalDiskUsed = 0
      let self = this
      if (typeof callback != 'undefined' && callback != null && callback.length !== 0) {
        callback.forEach((item) => {
          if (typeof item['disk.indices'] != 'undefined' && item['disk.indices'] != null) {
            let used = item['disk.indices']
            if (used.indexOf('kb') !== -1) {
              // 说明是kb结尾，直接加
              totalIndicesUse += parseFloat(used.replaceAll('kb', ''))
            } else if (used.indexOf('mb') !== -1) {
              // 说明是mb结尾，*1024转换成kb后直接加
              totalIndicesUse += parseFloat(used.replaceAll('mb', '')) * 1024
            } else if (used.indexOf('gb') !== -1) {
              // 说明是gb结尾，*1024*1024转换成kb后直接加
              totalIndicesUse += parseFloat(used.replaceAll('gb', '')) * 1024 * 1024
            }
          }
          if (typeof item['disk.used'] != 'undefined' && item['disk.used'] != null) {
            let used = item['disk.used']
            if (used.indexOf('kb') !== -1) {
              // 说明是kb结尾，直接加
              totalDiskUsed += parseFloat(used.replaceAll('kb', ''))
            } else if (used.indexOf('mb') !== -1) {
              // 说明是mb结尾，*1024转换成kb后直接加
              totalDiskUsed += parseFloat(used.replaceAll('mb', '')) * 1024
            } else if (used.indexOf('gb') !== -1) {
              // 说明是gb结尾，*1024*1024转换成kb后直接加
              totalDiskUsed += parseFloat(used.replaceAll('gb', '')) * 1024 * 1024
            }
          }
          if (typeof item['disk.total'] != 'undefined' && item['disk.total'] != null) {
            let used = item['disk.total']
            if (used.indexOf('kb') !== -1) {
              // 说明是kb结尾，直接加
              totalDisk += parseFloat(used.replaceAll('kb', ''))
            } else if (used.indexOf('mb') !== -1) {
              // 说明是mb结尾，*1024转换成kb后直接加
              totalDisk += parseFloat(used.replaceAll('mb', '')) * 1024
            } else if (used.indexOf('gb') !== -1) {
              // 说明是gb结尾，*1024*1024转换成kb后直接加
              totalDisk += parseFloat(used.replaceAll('gb', '')) * 1024 * 1024
            }
          }
        })
        // 如果大于1G
        if (totalIndicesUse > 1024 * 1024) {
          totalIndicesUse = totalIndicesUse / 1024 / 1024
          self.esBaseInfoList[3].num = self.toThousands(totalIndicesUse) + 'GB'
        } else if (totalIndicesUse > 1024) {
          totalIndicesUse = totalIndicesUse / 1024
          self.esBaseInfoList[3].num = self.toThousands(totalIndicesUse) + 'MB'
        } else {
          self.esBaseInfoList[3].num = self.toThousands(totalIndicesUse) + 'KB'
        }
        if (totalDisk !== 0) {
          self.diskPercent = (totalDiskUsed / totalDisk * 100).toFixed(2)
        }
      }
    },
    /**
     * 解析内存图表
     * @param callback
     */
    tranceMemory(callback) {
      let totalMemory = 0
      let totalMemoryUsed = 0
      let self = this
      if (typeof callback != 'undefined' && callback != null && callback.length !== 0) {
        callback.forEach((item) => {
          // 全部变成kb
          if (typeof item['ram.current'] != 'undefined' && item['ram.current'] != null) {
            let used = item['ram.current']
            if (used.indexOf('kb') !== -1) {
              // 说明是kb结尾，直接加
              totalMemoryUsed += parseFloat(used.replaceAll('kb', ''))
            } else if (used.indexOf('mb') !== -1) {
              // 说明是mb结尾，*1024转换成kb后直接加
              totalMemoryUsed += parseFloat(used.replaceAll('mb', '')) * 1024
            } else if (used.indexOf('gb') !== -1) {
              //说明是gb结尾，*1024*1024转换成kb后直接加
              totalMemoryUsed += parseFloat(used.replaceAll('gb', '')) * 1024 * 1024
            }
          }
          // 全部变成kb
          if (typeof item['ram.max'] != 'undefined' && item['ram.max'] != null) {
            let max = item['ram.max']
            if (max.indexOf('kb') !== -1) {
              // 说明是kb结尾，直接加
              totalMemory += parseFloat(max.replaceAll('kb', ''))
            } else if (max.indexOf('mb') !== -1) {
              // 说明是mb结尾，*1024转换成kb后直接加
              totalMemory += parseFloat(max.replaceAll('mb', '')) * 1024
            } else if (max.indexOf('gb') !== -1) {
              // 说明是gb结尾，*1024*1024转换成kb后直接加
              totalMemory += parseFloat(max.replaceAll('gb', '')) * 1024 * 1024
            }
          }
        });
        if (totalMemory !== 0) {
          self.memoryPercent = (totalMemoryUsed / totalMemory * 100).toFixed(2)
        }
      }
    }
  }

}
</script>

<style scoped>

</style>
<style>
/*===== Total Shards 特效 ===== */
.shared-animate {
  animation: spin 5s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/*===== Total Shards 特效 ===== */
</style>

<style>
/*===== Success Shards 特效 ===== */
.success-animate {
  -webkit-animation: scale 3.5s ease-in-out infinite;
}

@-webkit-keyframes scale {
  0%, 100% {
    -webkit-transform: scale(0.8);
  }
  50% {
    -webkit-transform: scale(1);
  }
}

/*===== Success Shards 特效 ===== */
</style>

<style>
/*===== indices 特效 =====*/
.index-animate {
  -webkit-animation: roundRule 7s ease-in-out infinite;
  -webkit-transform-origin: top center;
}

@-webkit-keyframes roundRule {
  0%, 100% {
    -webkit-transform: rotateY(0deg);
  }
  50% {
    -webkit-transform: rotateY(180deg);
  }
}

/*===== indices 特效 =====*/
</style>

