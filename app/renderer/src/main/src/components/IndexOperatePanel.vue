<template>
  <div class="pb-10 border-t dark:border-black">
    <div v-for="(item,index) in itemList" :key="index">
      <div class="father-item" :class="checkClassStyleByClickId(index)" @click="clickItem(item,index)"
           @contextmenu.prevent="fatherOnContextmenu(item,index)"
           @dblclick="itemDbClick(item,index)">
        <div class="father-item-left-div" style="display: inline-block;width: 90%">
          <i :class="!item.down?'el-icon-arrow-right':'el-icon-arrow-down'"
             @click="item.isActive? item.down = !item.down:null"
             class="text-blue-400"></i>
          <img :src="item.isActive?imgContainer.LogoElasticSearch24Color:imgContainer.LogoElasticSearch24Black"
               class="inline-block" alt="">
          <a class="dark:text-indexTitleTextColor dark:text-blue-50">{{ item.title }}</a>
        </div>
        <div class="status-icon">
          <i class="el-icon-loading" v-if="item.loading"></i>
          <div class="status-bar" :style="'background-color:'+item.status" v-else></div>
        </div>
      </div>
      <div v-if="item.down">
        <div class="child-item ml-5 text-left" v-for="(childItem,childIndex) in item.children"
             :class="checkClassStyleByClickId(index+'-'+childIndex)"
             :key="childIndex"
             @dblclick="childDbClick(childItem,index+'-'+childIndex)"
             @click="clickItem(item,index+'-'+childIndex)">
          <!--          <img :src="imgContainer.IndexIcon" alt="">-->
          <!--          <a :title="childItem.index" :style="'color:'+statusIconColor[childItem.health]">{{ childItem.index }}</a>-->
          <div class="status-bar" :style="'background-color:'+statusIconColor[childItem.health]"></div>
          <a :title="childItem.index" class="dark:text-indexTitleTextColor dark:text-blue-50">{{ childItem.index }}</a>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import LogoElasticSearch24Black from '../assets/pic/logo-elastic-search-24-black.png'
import LogoElasticSearch24Color from '../assets/pic/logo-elastic-search-24-color.png'
import IndexIcon from '../assets/pic/index_icon.png'
import ElasticsearchResolver from '../handler/functionHandler/ElasticsearchResolver-7.3.2'
import {Base64} from 'js-base64';
import {setCookie, delCookie} from "@/util/Cookie";
import bus from '@/handler/communicationHandler/eventBus'
import {getItem, setItem} from '@/util/LocalStorageUtil'
import {windowCreate} from '@/util/Plugins'

const {ipcRenderer} = window.require('electron')


/**
 * 左侧索引操作面板
 */
export default {
  name: "IndexOperatePanel",
  components: {},
  data() {
    return {
      imgContainer: {
        // 未激活的es图标
        LogoElasticSearch24Black: LogoElasticSearch24Black,
        // 激活下的es图标
        LogoElasticSearch24Color: LogoElasticSearch24Color,
        // 索引的图标
        IndexIcon: IndexIcon
      },
      statusIconColor: {
        'red': '#ff0000',
        'green': '#35ff00',
        'yellow': '#ffd500',
        'grey': '#868383'
      },
      // 当前被选中的id
      clickId: null,
      itemList: [],
      // 当前选中的uuid
      selectClusterUuid: '',
      clickX: null,
      clickY: null,
      isActive: false
    }
  },
  created() {
    const that = this
    this.elasticsearchResolver = new ElasticsearchResolver();
    ipcRenderer.on('connection_info_delete_result', function (event, message) {
      if (message.resolve === 1) {
        that.$message({
          message: '删除成功!',
          type: 'success'
        });
        const id = message.arg
        let findIndex = -1
        that.itemList.forEach((item, index) => {
          if (item.id === id) {
            findIndex = index
            return
          }
        })
        if (findIndex !== -1) {
          that.itemList.splice(findIndex, 1)
        }
      } else {
        that.$message.error('删除失败，' + message);
      }
      // ipcRenderer.send('init_connection_info', '')

    })
    ipcRenderer.on('index_info', function (event, message) {
      that.itemList = []
      if (typeof message != 'undefined' && message != null && message.length !== 0) {
        message.forEach((item) => {
          item.isActive = false
          item.children = []
          item.loading = false
          item.status = '#868383'
          item.down = false
          item.esClusterInfo = null
          item.esConnectionInfo = null
          item.allIndexInfo = null
          item.baseUrl = item.base_url
          item.version = item.es_version
          that.itemList.push(item)
        })
      }
    })
    ipcRenderer.send('init_connection_info', '')
  },
  mounted() {
    const that = this
    window.addEventListener('storage', (e) => {
      console.log(e)
      if (e.key === 'checkConnectionTitle') {
        const title = getItem('checkConnectionTitle').value
        let returnStr = ''
        that.itemList.forEach((item) => {
          if (item.title === title) {
            returnStr = '当前自定义名称已存在'
          }
        })
        setItem('receiveConnectionTitle', returnStr)
      } else if (e.key === 'addNewConnectionInfo') {
        that.$message({
          message: '添加成功!',
          type: 'success',
        });
        let item = getItem('addNewConnectionInfo').value
        item.isActive = false
        item.children = []
        item.loading = false
        item.status = '#868383'
        item.down = false
        item.esClusterInfo = null
        item.esConnectionInfo = null
        item.allIndexInfo = null
        item.baseUrl = item.connectionUrl
        that.itemList.push(item)
      } else if (e.key === 'updateConnectionInfo') {
        let item = getItem('updateConnectionInfo').value
        that.$message({
          message: '修改成功!',
          type: 'success',
        });
        let index = -1;
        for (let i = 0; i < that.itemList.length; i++) {
          if (item.id.toString() === that.itemList[i].id.toString()) {
            index = i
            break
          }
        }
        if (index !== -1) {
          that.itemList[index].baseUrl = item.connectionUrl
          that.itemList[index].connectionUrl = item.connectionUrl
          that.itemList[index].version = item.version
          that.itemList[index].es_version = item.version
          that.itemList[index].title = item.title
          that.itemList[index].passwd = item.password
          that.itemList[index].username = item.username
        }
      }
    })
  },
  methods: {
    /**
     * 单击方法
     * @param item
     * @param id
     */
    clickItem(item, id) {
      this.clickId = id
      if (item.isActive) {
        delCookie('Authorization')
        delCookie('baseUrl')
        if (!!item.username && !!item.passwd) {
          setCookie('Authorization', Base64.encode(item.username + ':' + item.passwd), 7)
        }
        setCookie('baseUrl', item.baseUrl, 7)
        if (item.esConnectionInfo.cluster_uuid !== this.selectClusterUuid) {
          // 与HomePage交互，告诉他要数据修改
          this.homePageInteractive(item)
          this.selectClusterUuid = item.esConnectionInfo.cluster_uuid
        }
      }
    },
    /**
     * 父条目双击方法
     * @param item
     * @param id
     */
    itemDbClick(item, id) {
      const that = this
      this.clickId = id
      delCookie('Authorization')
      delCookie('baseUrl')
      if (!!item.username && !!item.passwd) {
        setCookie('Authorization', Base64.encode(item.username + ':' + item.passwd), 7)
      }
      setCookie('baseUrl', item.baseUrl, 7)
      if (!item.isActive) {
        item.loading = true
        this.elasticsearchResolver.loginToEs((esConnectionInfo) => {
          that.elasticsearchResolver.getEsClusterStatus((esClusterStatus) => {
            const color = esClusterStatus.status
            if (typeof color !== 'undefined' && color !== '') {
              item.status = that.statusIconColor['grey']
              if (typeof that.statusIconColor[color] !== 'undefined') {
                item.status = that.statusIconColor[color]
              }
            }
            that.elasticsearchResolver.getAllIndex((callback) => {

              item.children = callback
              setTimeout(function () {
                // 取消loading载入
                item.loading = false
                // 激活状态
                that.itemList[id].isActive = true
                // 激活下拉
                that.itemList[id].down = true
                // 设置ES信息内部的一些变量
                item.esConnectionInfo = esConnectionInfo
                item.esClusterInfo = esClusterStatus
                item.allIndexInfo = callback
                // 与HomePage交互，告诉他要数据修改
                that.homePageInteractive(item)
                // 设置当前选中的uuid
                that.selectClusterUuid = item.esConnectionInfo.cluster_uuid
              }, Math.round(Math.random() * 1000))
            }, (error) => {
              this.throwErrorMsg(error, item)
            })
          }, (error) => {
            this.throwErrorMsg(error, item)
          })
        }, (error) => {
          this.throwErrorMsg(error, item)
        })
      } else {
        // 激活下拉
        this.itemList[id].down = !this.itemList[id].down
      }
    },
    /**
     * 抛出异常信息的公共方法
     * @param error
     * @param item
     */
    throwErrorMsg(error, item) {
      console.log(error)
      // 取消loading载入
      item.loading = false
      if (error.toString().indexOf('401') !== -1) {
        this.$message.error('ES认证错误：当前认证信息错误，请确认账号或密码是否有误');
      } else {
        this.$message.error('ES连接错误：' + error);
      }
    },
    /**
     * 选中后的样式格式校对
     * @param id
     * @returns {string}
     */
    checkClassStyleByClickId(id) {
      if (id === this.clickId) {
        return 'selected'
      }
      return 'normal'
    },
    /**
     * 组件中间通信发送消息的方法
     * @param key event事件编号
     * @param msg 需要传递的数据
     */
    sendMessage(key, msg) {
      bus.$emit(key, msg)
    },
    /**
     * 与HomePage之间进行交互
     */
    homePageInteractive() {
      this.sendMessage('init', '')
    },
    /**
     * 关闭或者打开连接
     * @param index
     */
    closeOrOpenConnection(index) {
      if (index != null && index >= 0 && index < this.itemList.length) {
        let item = this.itemList[index]
        if (item.isActive) {
          // 激活状态，需要关闭连接
          delCookie('Authorization')
          delCookie('baseUrl')
          item.isActive = false
          item.children = []
          item.down = false
          item.status = '#868383'
          this.sendMessage('stopAll')
        } else {
          // 关闭状态，需要激活连接
          this.itemDbClick(item, index)
        }
      }
    },
    /**
     * 删除连接信息
     * @param id 连接信息在数据库中的id
     */
    deleteConnection(id) {
      this.$confirm('此操作将永久删除该连接, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ipcRenderer.send('delete_connection_info', id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    /**
     * 编辑连接
     * @param checkId
     * @param index
     */
    editConnection(checkId, index) {
      const data = this.itemList[index]
      console.log(data)
      if (data.isActive) {
        this.$message.error('请先关闭当前连接')
        return
      }
      let routeUrl = this.$router.resolve({
        path: "/editConnection",
        query: {
          id: data.id,
          title: data.title,
          connectionUrl: data.baseUrl,
          username: data.username,
          password: data.passwd,
          version: typeof data.es_version === 'undefined' ? typeof data.version !== 'undefined' ? data.version : '7.3.2' : data.es_version
        }
      });
      windowCreate(ipcRenderer, {
        isMainWin: false,
        route: routeUrl.href,
        webPreferences: {
          // 可以过滤跨域的问题
          webSecurity: false,
          // 允许在renderer进程使用node的功能
          nodeIntegration: true,
          // 上下文环境隔离关闭
          contextIsolation: false
        },
        titleBarStyle: 'default',
        title: "修改信息",
        show: false, // 先隐藏
        parentId: 1,
        modal: true
      })
    },
    /**
     * 重构后的右键菜单
     * @param item
     * @param index
     * @returns {boolean}
     */
    fatherOnContextmenu(item, index) {
      ipcRenderer.send('send_message_load', '{ad:"1"}')
      this.clickId = index
      // 被点击的元素，在数据库中的ID
      let checkId = this.itemList[index].id
      this.$contextmenu({
        items: [
          {
            label: item.isActive ? '关闭连接' : '打开连接',
            disabled: item.loading,
            onClick: () => {
              this.closeOrOpenConnection(index)
            }
          },
          // { label: "前进(F)", disabled: true },
          {
            label: "删除连接",
            onClick: () => {
              this.deleteConnection(checkId)
            }
          },
          {
            label: "编辑连接...",
            divided: true,
            icon: "el-icon-view",
            onClick: () => {
              this.editConnection(checkId, index)
            }
          },
          {
            label: "重新加载(R)",
            icon: "el-icon-refresh",
            disabled: !item.isActive,
            onClick: () => {
              this.closeOrOpenConnection(index)
              this.itemDbClick(item, index)
            }
          },
          // { label: "投射(C)...", divided: true },
          // {
          //   label: "使用网页翻译(T)",
          //   divided: true,
          //   minWidth: 0,
          //   children: [{ label: "翻译成简体中文" }, { label: "翻译成繁体中文" }]
          // },
          // {
          //   label: "截取网页(R)",
          //   minWidth: 0,
          //   children: [
          //     {
          //       label: "截取可视化区域",
          //       onClick: () => {
          //         this.message = "截取可视化区域";
          //         console.log("截取可视化区域");
          //       }
          //     },
          //     { label: "截取全屏" }
          //   ]
          // },
          // { label: "查看网页源代码(V)", icon: "el-icon-view" },
          // { label: "检查(N)" }
        ],
        event,
        customClass: "custom-class",
        zIndex: 3,
        minWidth: 230
      });
      return false;
    },
    childDbClick(item, key) {
      this.sendMessage('addNewPage', {
        title: item.index,
        name: key,
      })
    }
  }
}
</script>

<style scoped>
.father-item, .child-item {
  text-align: left;
  width: 90%;
  border-radius: 5px;
  margin-left: 5%;
  margin-top: 10px;
  cursor: default;
  transition: all .4s;
}

.child-item, .father-item a {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 13px;
  -webkit-user-select: none;
  user-select: none;
  line-height: 15px;
  max-width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.father-item img {
  padding: 0;
  width: 12px;
  height: 12px;
  margin: 0 3px;
  -webkit-user-select: none;
  user-select: none;
}

.child-item img {
  padding: 0;
  width: 12px;
  height: 12px;
  margin: 0 3px;
}

.father-item i {
  z-index: 9999;
}

.status-icon {
  display: inline-block;
  width: 10%;
  text-align: center;
}

.status-bar {
  border-radius: 50px;
  width: 10px;
  height: 10px;
  display: inline-block;
  margin-right: 5px;
}

.child-item {
  margin-top: 10px;
  padding-left: 30px;
}
</style>
<style>
.el-icon-arrow-right, .el-icon-arrow-down {
  font-size: 15px;
}

.selected {
  background-color: #1d5fe8;
}

.el-icon-loading {
  color: #06ffb4;
}
</style>

<style>
/*深色*/
@media (prefers-color-scheme: dark) {

}

/*浅色*/
@media (prefers-color-scheme: light) {

}
</style>

