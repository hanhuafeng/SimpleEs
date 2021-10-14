<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 dark:bg-asideBg">
            <tr>
              <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                  v-for="(item,index) in headers" :key="index">
                {{ item }}
              </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-headBlackBg ">
            <tr v-for="(node,index) in data" :key="index">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full"
                         :src="node.master === '*'?nodeIconLogoResources.masterNodeIcon :nodeIconLogoResources.slaveNodeIcon "
                         alt="">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 text-left dark:text-gray-300">
                      {{ node.name }}
                    </div>
                    <div class="text-sm text-gray-500 text-left dark:text-gray-300">
                      {{ node.ip }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="text-sm px-6 py-4 whitespace-nowrap text-left text-gray-900 dark:text-gray-300">
                {{ node.shards }}
              </td>
              <td class="text-sm px-6 py-4 whitespace-nowrap text-left text-gray-900 dark:text-gray-300">
                {{ node.cpu }}%
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-left ">
                <div class="text-sm text-gray-900 text-gray-900 dark:text-gray-300">
                  1分钟系统负载:{{ (parseFloat(node.load_1m)*100).toFixed(2) }}%
                </div>
                <div class="text-sm text-gray-500 text-gray-900 dark:text-gray-300">
                  5分钟系统负载:{{ (parseFloat(node.load_5m)*100).toFixed(2) }}%
                </div>
                <div class="text-sm text-gray-500 text-gray-900 dark:text-gray-300">
                  15分钟系统负载:{{ (parseFloat(node.load_15m)*100).toFixed(2) }}%
                </div>
              </td>
              <td class="text-sm px-6 py-4 whitespace-nowrap text-left text-gray-900 dark:text-gray-300">
                {{ node.ramPercent }}%
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-left ">
                <div class="text-sm text-gray-900 text-gray-900 dark:text-gray-300">已经使用:{{ node.diskUsed }}</div>
                <div class="text-sm text-gray-500 text-gray-900 dark:text-gray-300">剩余可用:{{ node.diskAvail }}</div>
                <div class="text-sm text-gray-500 text-gray-900 dark:text-gray-300">磁盘总量:{{ node.diskTotal }}</div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * ES集群信息表格
 */
import MasterNodeIcon from '@/assets/pic/master_node_icon.png'
import SlaveNodeIcon from '@/assets/pic/slave_icon.png'

export default {
  name: "EsClusterInfoTable",
  props: ['headers', 'data'],
  data() {
    return {
      nodeIconLogoResources: {
        masterNodeIcon: MasterNodeIcon,
        slaveNodeIcon: SlaveNodeIcon
      }
    }
  }
}
</script>

<style scoped>

</style>
