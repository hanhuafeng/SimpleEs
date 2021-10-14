<template>
  <div class="flex flex-row">
    <div
        class="cursor-pointer transition w-20 ml-2 min-w-20"
        style="min-width: 5rem"
        v-for="(item, index) in functionImgContainer.filter(it => it.isShow === true)" @click="item.function(item.id)"
        :key="index">
      <div class="m-mask mt-1.5 flex flex-col items-center justify-center select-none hover:bg-gray-300">
        <img :src="item.icon" :style="{ width:item.width,height:item.height, }" alt="">
        <div class="text-sm text-white">
          <span class="text-purple-600 dark:text-indigo-200">{{ item.title }}</span>
        </div>
      </div>
    </div>
  </div>

</template>


<script>
import ConnectIcon from '../assets/pic/connect_icon.png'
import ConnectIconYellow from '../assets/pic/connect_icon_yellow.png'
import SQLTranceIcon from '../assets/pic/sql_trance_icon.png'
import {windowCreate} from '@/util/Plugins'

const {ipcRenderer} = window.require('electron')

export default {
  /*
    顶部功能栏
  */
  name: "FunctionBar",
  data() {
    return {
      functionImgContainer: [
        /**
         * 头部功能合集
         */
        {
          id: 1,
          icon: ConnectIcon,
          width: '40px',
          height: '40px',
          function: this.addNewConnection,
          title: "连接",
          isShow: true
        },
        {
          icon: ConnectIconYellow,
          width: '60px',
          height: '50px',
          function: this.functionDistributionHandler,
          title: "连接",
          isShow: false
        },
        {
          id: 3,
          icon: SQLTranceIcon,
          width: '40px',
          height: '40px',
          function: this.functionDistributionHandler,
          title: "SQL转换",
          isShow: true
        }
      ],
      picSize: {
        width: '60px',
        height: '50px'
      }
    }
  },
  created() {
  },
  methods: {
    /**
     * 方法分配解析器
     * @param functionId
     */
    functionDistributionHandler(functionId) {
      console.log(functionId)
    },
    /**
     * 打开一个新建连接信息的窗体
     */
    addNewConnection() {
      let routeUrl = this.$router.resolve({
        path: "/addNewConnection",
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
        title: "新增连接信息",
        show: false, // 先隐藏
        parentId: 1,
        modal: true
      })
    }
  }
}
</script>

<style scoped>

</style>

<style>
/**
图标
*/
.icon {
  /*padding: 5px;*/
  width: 65px;
  height: 65px;
  display: inline-block;
}

/**
logo 图标+标题的组合体
*/
.m-mask {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  transition: all .6s;
  /*text-align: center !important;*/
}

.m-mask:hover {
  /*background-color: #fff;*/
  /*filter: Alpha(Opacity=60);*/
  /*opacity: 0.4;*/
  /*background-color: rgba(255, 255, 255, 0.2);*/
  /*cursor: pointer;*/
}

.m-mask:hover > div > span {
  color: rgb(132, 58, 204) !important;
}

/*.mask:hover > div > img {*/
/*  text: expression(src=functionImgContainer.connectIconYellow;*/
/*}*/

/**
图标下面的标题
 */
.icon-title {
  line-height: 5px;
  text-align: center;
  width: 100%;
  margin: 0;
  padding: 0
}

.icon-title span {
  font-size: 13px;
  margin: 0;
  padding: 0;
  color: #5c5e5f
}
</style>
