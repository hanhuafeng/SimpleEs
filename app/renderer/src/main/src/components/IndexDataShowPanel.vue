<template>
  <div class="h-full">
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8" style="height: calc(100% - 40px)">
      <div class="align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="mbl-head">
            <tr>
              <th class="px-6 py-1 text-left text-base font-medium text-gray-500 tracking-wider dark:text-gray-300">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"/>
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
            <tbody class="divide-y divide-gray-200 mbl overflow-auto">
            <tr v-for="(items,index) in dataList" :key="index" @contextmenu.prevent="childOnContextmenu(items)">
              <td class="text-sm px-6 py-1 whitespace-nowrap text-left text-gray-900 dark:text-gray-300">
                <!--                  <el-button size="mini" round type="danger" class="cursor-pointer" @click="deleteItem(items)">删除-->
                <!--                  </el-button>-->
                <el-checkbox v-model="checkedIds.includes(items[0])"
                             @change="handleCheckedChange(items[0])"/>
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
    <div
        class=" bottom-0 left-0 right-0 border-solid border-t rounded rounded-br-lg operation-div-bkg flex items-center justify-between pl-2"
        style="height: 40px">
      <div>
        <div class="inline-block"><i
            class="el-icon-circle-plus-outline text-black dark:text-white text-2xl operation-icon cursor-pointer"></i>
        </div>
        <div class="inline-block ml-2" @click="deleteManyDoc"><i
            class="el-icon-remove-outline text-black dark:text-white text-2xl	operation-icon cursor-pointer"></i>
        </div>
        <div class="inline-block ml-2" @click="reloadData()"><i
            class="el-icon-refresh text-black dark:text-white text-2xl operation-icon cursor-pointer"></i></div>
      </div>
      <div class="flex items-center mr-2">
        <div @click="prePage">
          <i class="el-icon-caret-left text-black dark:text-white text-2xl cursor-pointer operation-icon"></i>
        </div>
        <div>
          <input v-model="nowPage" placeholder="翻页"
                 class="rounded w-7 bg-headBlackBg text-white dark:bg-white dark:text-black"
                 @keyup.enter="initDataList">
        </div>
        <div class="" @click="nextPage">
          <i class="el-icon-caret-right text-black dark:text-white text-2xl cursor-pointer operation-icon"></i>
        </div>
        <transition name="el-fade-in">
          <div class="ml-2 " v-show="settingShow">
            <span class="text-black dark:text-white">限制 </span>
            <input type="number" v-model="limit" class="rounded w-11" @keyup.enter="initDataList">
            <span class="text-black dark:text-white"> 条/页</span>
          </div>
        </transition>
        <div class="ml-2" @click="settingShow=!settingShow">
          <i class="el-icon-s-tools text-black dark:text-white text-2xl operation-icon cursor-pointer"></i>
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
      messageTitle: '',
      limit: 10,
      settingShow: false,
      nowPage: 1,
      checkedIds: []
    }
  },
  computed: {
    isIndeterminate() {
      return this.checkedIds.length > 0 && this.checkedIds.length < this.dataList.length
    },
    checkAll: {
      get() {
        return this.checkedIds.length > 0 && this.checkedIds.length === this.dataList.length
      },
      set(val) {
        return val
      }
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
      if (this.nowPage <= 0) {
        this.$message.warning('页码不能小于等于0')
        return
      }
      if (this.limit <= 0) {
        this.$message.warning('展示条数不能小于等于0')
        return
      }
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
          let from_ = (parseInt(this.nowPage) - 1) * parseInt(that.limit)
          let queryData = {from: from_, size: parseInt(that.limit)}
          // 再拿所有的条目
          elasticsearchResolver732.getIndexData(this.childIndexName, queryData, (callback) => {
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

      let showInfo = {'_id': this.dataList[index][0]}
      for (let i = 0; i < this.headers.length; i++) {
        showInfo[this.headers[i]] = this.dataList[index][i + 1]
      }
      this.userOperationInfo = showInfo
      this.messageTitle = showInfo['_id']
      this.messageShow = true
    },
    /**
     * 重载数据
     * @param index
     */
    reloadData(index) {
      this.initDataList()
    },
    prePage() {
      if (this.nowPage !== 1) {
        this.nowPage = parseInt(this.nowPage) - 1
        this.initDataList()
      }
    },
    nextPage() {
      this.nowPage = parseInt(this.nowPage) + 1
      this.initDataList()
    },
    /**
     * 每一条的右键菜单
     * @param item
     * @param index
     * @returns {boolean}
     */
    childOnContextmenu(item, index) {
      this.clickId = index
      this.$contextmenu({
        items: [
          {
            label: "删除记录",
            icon: "el-icon-delete",
            onClick: () => {
              this.deleteItem(item)
            }
          }
        ],
        event,
        customClass: "custom-class",
        zIndex: 3,
        minWidth: 230
      });
      return false;
    },
    handleCheckAllChange(val) {
      console.log(val)
      if (val) {
        this.checkedIds = this.dataList.map(it => it[0])
      } else {
        this.checkedIds = []
      }
      console.log(this.checkedIds)
    },
    handleCheckedChange(value) {
      if (this.checkedIds.includes(value)) {
        this.checkedIds.splice(this.checkedIds.findIndex(it => it === value))
      } else {
        this.checkedIds.push(value)
      }
    },
    deleteManyDoc() {
      const that = this
      if (this.checkedIds.length === 0) {
        this.$message.warning('请先选择要删除的文档')
        return
      }
      this.$confirm('此操作将永久删除此批文档, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.elasticsearchResolver732.deleteManyDocs(that.childIndexName, that.checkedIds, (callback) => {
          if (callback.deleted !== 0) {
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
          that.throwErrorMsg(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
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
