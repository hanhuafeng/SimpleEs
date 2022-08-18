<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="mbl-head">
            <tr>
              <th class="px-6 py-1 text-left text-base font-medium text-gray-500 tracking-wider dark:text-gray-300">
                操作
              </th>
              <th class="px-6 py-1 text-left text-base font-medium text-gray-500 tracking-wider dark:text-gray-300">
                _id
                <el-tooltip class="item" effect="dark" content="单击_id的值可查看详细信息" placement="right">
                  <i class="el-icon-info text-gray-400"></i>
                </el-tooltip>

              </th>
              <th scope="col"
                  class="px-6 py-1 text-left text-base font-medium text-gray-500 tracking-wider dark:text-gray-300"
                  v-for="(item,index) in headers" :key="index">
                {{ item }}
              </th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 mbl">
            <tr v-for="(items,index) in dataList" :key="index">
              <td class="text-sm px-6 py-1 whitespace-nowrap text-left text-gray-900 dark:text-gray-300">
                <el-button size="mini" round type="danger" class="cursor-pointer" @click="deleteItem(items)">删除
                </el-button>
              </td>
              <td class="text-sm px-6 py-1 whitespace-nowrap text-left text-gray-900 dark:text-gray-300 cursor-pointer">
                <a @click="showInfo(index)">{{ items[0] }}</a>
              </td>
              <td class="text-sm px-6 py-1 whitespace-nowrap text-left text-gray-900 dark:text-gray-300"
                  v-for="item in items.slice(1,items.length)">
                <a>{{ item }}</a>
              </td>
            </tr>
            </tbody>
          </table>
          <transition name="el-zoom-in-center">
            <Message v-if="messageShow"
                     v-model="messageShow"
                     :info="userOperationInfo"
                     :title="messageTitle"/>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import ElasticsearchResolver from '../handler/functionHandler/ElasticsearchResolver-7.3.2'
import Message from '@/components/message/Message'

/**
 * 索引数据展示页
 */
export default {
  name: "IndexDataShowPanel",
  props: ['childIndexName'],
  components: {
    Message
  },
  created() {
    this.elasticsearchResolver732 = new ElasticsearchResolver()
    this.initDataList()
  },
  data() {
    return {
      headers: [],
      dataList: [],
      elasticsearchResolver732: null,
      messageShow: false,
      userOperationInfo: {},
      messageTitle:''
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
    },
    initDataList() {
      this.headers = []
      this.dataList = []
      let that = this
      const elasticsearchResolver732 = this.elasticsearchResolver732
      // 拿到所有的列名
      elasticsearchResolver732.getIndexColumnHeads(this.childIndexName, (callback) => {
        console.log(callback[that.childIndexName])
        that.headers = []
        if (typeof callback !== 'undefined'
            && callback !== null
            && typeof callback[that.childIndexName] !== 'undefined'
            && callback[that.childIndexName] !== null) {
          for (const key in callback[that.childIndexName].mappings.properties) {
            that.headers.push(key)
          }
          // 再拿所有的条目
          elasticsearchResolver732.getIndexData(this.childIndexName, (callback) => {
            console.log(callback.hits.hits)
            // that.dataList.push(callback.hits.hits)
            // console.log(that.dataList)
            if (typeof callback !== 'undefined'
                && typeof callback.hits !== 'undefined'
                && callback.hits != null
                && typeof callback.hits.hits !== 'undefined'
                && callback.hits.hits != null
                && callback.hits.hits.length !== 0)
              callback.hits.hits.forEach((item) => {
                let data = []
                let sourceKey = []
                data.push(item._id)
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
    throwErrorMsg(error, item) {
      console.log(error)
      // 取消loading载入
      item.loading = false
      if (error.toString().indexOf('401') !== -1) {
        this.$message.error('ES认证错误：当前认证信息错误，请确认账号或密码是否有误');
      } else {
        try {
          this.$message.error('ES操作错误：' + error.response.data.error.reason);
        } catch (e) {
          this.$message.error('ES操作错误：' + error);
        }
      }
    },
    deleteItem(item) {
      let that = this
      this.$confirm('此操作将永久删除该文档, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _id = item[0]
        that.elasticsearchResolver732.deleteIndexItem(that.childIndexName, _id, (callback) => {
          if (callback.result === "deleted") {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 2000,
              onClose: function () {
                that.initDataList()
              }
            });
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            });
          }
        }, (error) => {
          that.throwErrorMsg(error, item)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    /**
     * Message展示信息
     * @param index
     */
    showInfo(index) {

      let showInfo = {'_id':this.dataList[index][0]}
      for (let i = 0; i < this.headers.length; i++) {
        showInfo[this.headers[i]] = this.dataList[index][i+1]
      }
      this.userOperationInfo = showInfo
      this.messageTitle = showInfo['_id']
      this.messageShow = true
    }
  }
}
</script>

<style scoped>
@media (prefers-color-scheme: dark) {
  .mbl {
    /*backdrop-filter: blur(20px);*/
    background-color: rgba(255, 255, 255, 0.08);
  }

  .mbl-head {
    /*backdrop-filter: blur(20px);*/
    background-color: rgba(255, 255, 255, 0.1);
  }
}

@media (prefers-color-scheme: light) {

}
</style>
