<template>
  <div class="w-full h-full main-panel bg-connectionInfoBackGroundColorLight dark:bg-connectionInfoExternalColor">
    <div class="info-panel border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-connectionInfoMainColor">
      <div class="tab-panel flex flex-row items-center align-middle select-none grid border-gray-400 dark:border-white">
        <div class="w-auto  align-middle info-panel-title bg-blue-600 rounded pl-2 pr-2 justify-self-center text-white">
          常规
        </div>
      </div>
      <div class="input-panel h-full w-full">
        <div class="h-20 flex flex-row justify-center pt-3">
          <!--          用来画图标-->
          <div class="mr-5">
            <div class="h-3/4 text-center pl-2">
              <img src="../assets/logo.png" alt="" class="h-full">
            </div>
            <div class="h-1/4 leading-6	text-base">SimpleEs</div>
          </div>
          <div class="mr-5 border-t-2 border-black dark:border-white" style="width: 200px;margin-top: 30px"></div>
          <div class="">
            <div class="h-3/4 select-none pl-5">
              <img src="../assets/pic/logo-elastic-search-24-color.png" alt="" class="h-full">
            </div>
            <div class="h-1/4 leading-6	text-base">ElasticSearch</div>
          </div>
        </div>

        <div class="mt-8 grid grid-cols-3">
          <div class="align-middle text-right"><span class="text-red-600">*</span>自定义连接名：</div>
          <div class="align-middle col-span-2 flex flex-row">
            <input
                class="w-1/2 dark:bg-connectionInfoInputColor rounded focus:ring-2 focus:ring-blue-600 border dark:border-none"
                v-model="connectionInfo.title" @blur="checkConnectionTitle">
            <div class="text-red-600 ml-2">{{ connectionInfo.titleErrorMsg }}</div>
          </div>
        </div>
        <div class="mt-2 grid grid-cols-3">
          <div class="align-middle text-right"><span class="text-red-600">*</span>连接地址：</div>
          <div class="align-middle col-span-2 flex flex-row">
            <input
                class="w-1/2 dark:bg-connectionInfoInputColor rounded focus:ring-2 focus:ring-blue-600 border dark:border-none"
                placeholder="例如:http://127.0.0.1:9200/" v-model="connectionInfo.connectionUrl"
                @blur="checkConnectionUrl">
            <div class="text-red-600 ml-2">{{ connectionInfo.connectionUrlErrorMsg }}</div>
          </div>
        </div>
        <div class="mt-2 grid grid-cols-3">
          <div class="align-middle text-right">用户名：</div>
          <div class="align-middle col-span-2 ">
            <input
                class="w-1/2 dark:bg-connectionInfoInputColor rounded focus:ring-2 focus:ring-blue-600 border dark:border-none"
                v-model="connectionInfo.username">
          </div>
        </div>
        <div class="mt-2 grid grid-cols-3">
          <div class="align-middle text-right">密码：</div>
          <div class="align-middle col-span-2 ">
            <input
                class="w-1/2 dark:bg-connectionInfoInputColor rounded focus:ring-2 focus:ring-blue-600 border dark:border-none"
                type="password"
                v-model="connectionInfo.password">
          </div>
        </div>
        <div class="mt-2 grid grid-cols-3">
          <div class="align-middle text-right"><span class="text-red-600">*</span>ES版本：</div>
          <div class="align-middle col-span-2 ">
            <select v-model="connectionInfo.version"
                    class="bg-white text-black dark:bg-connectionInfoInputColor dark:text-white focus:ring-2 focus:ring-blue-600 border rounded dark:border-none">
              <option>7.3.2</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="operation-panel">
      <div class="grid grid-cols-2 mt-2">
        <div>
          <button
              class="text-white pl-3 pr-3 pt-1 pb-1 bg-green-500 rounded text-xs hover:bg-green-600 active:bg-green-900"
              @click="testConnect">
            测试连接
          </button>
        </div>
        <div class="text-right">
          <button
              class="text-white pl-3 pr-3 pt-1 pb-1 bg-green-500 rounded text-xs hover:bg-green-600 active:bg-green-900 mr-5"
              @click="destroy">
            取消
          </button>
          <button class="text-white pl-3 pr-3 pt-1 pb-1 rounded text-xs bg-blue-600 active:bg-blue-900"
                  @click="addNewConnectionInfo">保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getItem, setItem} from '@/util/LocalStorageUtil'
import axios from 'axios'
import {Base64} from 'js-base64';

const {ipcRenderer} = window.require('electron')

export default {
  name: "AddNewConnectionPanel",
  data() {
    return {
      connectionInfo: {
        // 连接地址
        connectionUrl: '',
        // 连接地址错误信息
        connectionUrlErrorMsg: '',
        // 自定义连接名称
        title: '',
        // 自定义连接名称
        titleErrorMsg: '',
        password: '',
        username: '',
        version: '7.3.2'
      }
    }
  },
  mounted() {
    const self = this
    window.addEventListener('storage', (e) => {
      if (e.key === 'receiveConnectionTitle') {
        self.connectionInfo.titleErrorMsg = getItem('receiveConnectionTitle').value
      }
    })
  },
  created() {
    let that = this
    ipcRenderer.on('add_new_connection_result', function (event, message) {
      if (typeof message !== 'undefined' && message !== null && typeof message.code !== 'undefined' && message.code === 1) {
        that.connectionInfo.id = message.data.id
        setItem('addNewConnectionInfo',that.connectionInfo)
        that.destroy()
      } else {
        that.$message.error('添加失败，' + message);
      }
    })
  },
  methods: {
    /**
     * 销毁当前页面
     */
    destroy() {
      window.close();
    },
    /**
     * 校对连接信息
     * */
    checkConnectionUrl() {
      if (this.connectionInfo.connectionUrl === '') {
        this.connectionInfo.connectionUrlErrorMsg = '请输入连接地址'
        return
      }
      const pattern = /(http|https):\/\/([\w.]+\/?)\S*/;
      if (!pattern.test(this.connectionInfo.connectionUrl)) {
        this.connectionInfo.connectionUrlErrorMsg = '基础格式错误'
      } else {
        const pattern_1 = /(http|https):\/\/([\w.]+\/?)\S*\//;
        if (!pattern_1.test(this.connectionInfo.connectionUrl)) {
          this.connectionInfo.connectionUrlErrorMsg = '请以/结尾'
        } else {
          this.connectionInfo.connectionUrlErrorMsg = ''
        }
      }
    },
    /**
     * 校对自定义连接名称
     */
    checkConnectionTitle() {
      if (this.connectionInfo.title === '') {
        this.connectionInfo.titleErrorMsg = '请填写自定义连接名称'
        return
      }
      setItem('checkConnectionTitle', this.connectionInfo.title)
    },
    /**
     * 最终的增加逻辑
     */
    addNewConnectionInfo() {
      this.checkConnectionUrl()
      this.checkConnectionTitle()
      if (this.connectionInfo.connectionUrlErrorMsg === '' && this.connectionInfo.titleErrorMsg === '') {
        ipcRenderer.send('add_new_connection_info', this.connectionInfo)
      }
    },
    /**
     * 测试能否访问成功
     */
    testConnect() {
      this.checkConnectionUrl()
      if (this.connectionInfo.connectionUrlErrorMsg !== '') {
        this.$message.error(this.connectionInfo.connectionUrlErrorMsg)
        return
      }
      let headers = {}
      if (!!this.connectionInfo.username && !!this.connectionInfo.password) {
        headers['Authorization'] = "Basic " + Base64.encode(this.connectionInfo.username + ':' + this.connectionInfo.password)
      }
      axios({
        method: 'get',
        url: this.connectionInfo.connectionUrl,
        responseType: 'json',
        headers: headers
      }).then(resp => {
        console.log(resp)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
.info-panel {
  /*width: 96%;*/
  height: 90%;
  border: 1px solid;
}

.main-panel {
  /*padding-left: 2%;*/
  /*padding-top: 2%;*/
  /*padding-right: 2%;*/
  padding: 2% 2% 0 2%;
}

.operation-panel {
  height: 8%;
}

.tab-panel {
  border-bottom: 1px solid;
  height: 35px;
}

.input-panel {
  height: 90%
}

.info-panel-title {
  font-family: myFirstFont, serif;
}
</style>
