<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 dark:bg-asideBg">
            <tr>
              <th scope="col"
                  class="px-6 py-1 text-left text-base font-medium text-gray-500 tracking-wider dark:text-gray-300"
                  v-for="(item,index) in headers" :key="index">
                {{ item }}
              </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-headBlackBg ">
            <tr v-for="(items,index) in dataList" :key="index">
              <td class="text-sm px-6 py-1 whitespace-nowrap text-left text-gray-900 dark:text-gray-300"
                  v-for="item in items">
                <a>{{ item }}</a>
                <!--                <a>1</a>-->
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
import ElasticsearchResolver from '../handler/functionHandler/ElasticsearchResolver-7.3.2'

/**
 * 索引数据展示页
 */
export default {
  name: "IndexDataShowPanel",
  props: ['childIndexName'],
  created() {
    const elasticsearchResolver732 = new ElasticsearchResolver()
    let that = this
    // 拿到所有的列名
    elasticsearchResolver732.getIndexColumnHeads(this.childIndexName, (callback) => {
      console.log(callback)
      that.headers = ['_id']
      if (typeof callback !== 'undefined'
          && callback !== null
          && typeof callback[that.childIndexName] !== 'undefined'
          && callback[that.childIndexName] !== null) {
        for (const key in callback[that.childIndexName].mappings.properties) {
          that.headers.push(key)
        }
        // 再拿所有的条目
        elasticsearchResolver732.getIndexData(this.childIndexName, (callback) => {
          // that.dataList.push(callback.hits.hits)
          // console.log(that.dataList)
          if (typeof callback !== 'undefined' && callback != null
              && typeof callback.hits !== 'undefined' && callback.hits != null
              && typeof callback.hits.hits !== 'undefined' && callback.hits.hits != null && callback.hits.hits.length !== 0)
            callback.hits.hits.forEach((item) => {
              console.log(item._source)
              console.log(item._id)
              console.log(that.headers)
              let data = []
              let sourceKey = []
              data.push(item._id)
              console.log('=============')
              for (let i in item._source) {
                sourceKey.push(i)
              }
              that.headers.forEach((header) => {
                if (header !== '_id') {
                  if (sourceKey.indexOf(header) !== -1) {
                    data.push(item._source[header])
                  } else {
                    data.push('')
                  }
                }
              })
              console.log('=============')
              that.dataList.push(data)
            })
        }, (error) => {
          console.error(error)
        })
      }
    }, (error) => {
      console.log(error)
    })
  },
  data() {
    return {
      headers: [],
      dataList: []
    }
  },
  methods: {
    dataDbClick(item) {
      console.log(item)
      item['click'] = !item['click']
    },
    checkDataText(key, dict) {
      if (dict.get(key)) {

      }
    }
  }
}
</script>

<style scoped>

</style>
