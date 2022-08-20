<template>
  <div>
    <el-tabs v-model="editableTabsValue" type="card" @edit="handleTabsEdit" closable class="h-full">
      <el-tab-pane label="首页" name="mainPage" class="h-full overflow-y-auto overflow-x-hidden">
        <home-page-panel></home-page-panel>
      </el-tab-pane>
      <el-tab-pane
          :key="item.name"
          v-for="(item, index) in editableTabs"
          :label="item.title"
          :name="item.name"
          class="h-full overflow-y-auto overflow-x-hidden static bkg">
        <IndexDataShowPanel
            :childIndexName="item.title"
            ref="indexDataShowPanel"
        ></IndexDataShowPanel>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import HomePagePanel from "@/components/HomePagePanel";
import bus from '@/handler/communicationHandler/eventBus'
import IndexDataShowPanel from "@/components/IndexDataShowPanel";

/**
 * 右侧主操作面板
 */
export default {

  name: "OperationTabPanel",
  components: {
    IndexDataShowPanel,
    HomePagePanel: HomePagePanel
  },
  data() {
    return {
      editableTabsValue: 'mainPage',
      editableTabs: []
    }
  },
  mounted() {
    let that = this
    bus.$on('addNewPage', function (param) {
      let flag = false
      for (let i = 0; i < that.editableTabs.length; i++) {
        if (that.editableTabs[i].name === param.name) {
          flag = true
          break
        }
      }
      if (!flag) {
        that.editableTabs.push(param)
      }
      that.editableTabsValue = param.name
    })
  },
  watch: {
    editableTabsValue: {// 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        console.log("editableTabsValue:" + val, oldVal);
      },
      deep: true // true 深度监听
    }
  },
  created() {
  },
  methods: {
    handleTabsEdit(targetName, action) {
      if (action === 'remove' && targetName !== 'mainPage') {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    },
    /**
     * 组件中间通信发送消息的方法
     * @param key event事件编号
     * @param msg 需要传递的数据
     */
    sendMessage(key, msg) {
      bus.$emit(key, msg)
    }
  }
}
</script>

<style scoped>

</style>
<style>
.el-tabs__item {
  color: white;
  -webkit-user-select: none;
  user-select: none;
}

.el-tabs__header {
  margin-bottom: 0;
}

.el-tabs__item {
  font-family: myFirstFont, serif;
}

.el-tabs__content {
  height: calc(100% - 41px);
  overflow: auto;
  /*padding-bottom: 10px;*/
}

.el-tabs__nav-wrap {

}

/*深色*/
@media (prefers-color-scheme: dark) {
  .el-tabs__item {
    color: white;
    border: none;
    border-right: 1px solid gray !important;
    /*margin-top: 0.5px;*/
    /*margin-bottom: 0.5px;*/
  }

  .el-tabs--card > .el-tabs__header {
    background-color: #323232;
    border: none;
    border-top: 1px solid black;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border: none;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__item {
    border: none;
  }

  .is-active {
    background-color: #1e1e1e;
  }

  .bkg {
    background-image: url("../assets/pic/dark_bkg_1.jpeg");
    /*filter: blur(1px);*/
  }

  .operation-div-bkg {
    backdrop-filter: blur(15px);
    background-color: rgba(255, 255, 255, 0.08);
  }

  .operation-icon:hover {
    color: #cc7643;
  }
}

/*浅色*/
@media (prefers-color-scheme: light) {
  .el-tabs__item {
    color: black;
  }

  /*.el-tabs--card>.el-tabs__header {*/
  /*  border-bottom: 1px solid gray;*/
  /*}*/
  .bkg {
    /*background-image: url("../assets/pic/light_bkg_1.jpeg");*/
    /*filter: blur(1px);*/
  }

  .operation-icon:hover {
    color: #19d3e5;
  }
}
</style>
