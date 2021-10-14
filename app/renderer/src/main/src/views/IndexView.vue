<template>
  <el-container class="h-screen bg-white dark:bg-elMainBlackBg">
    <el-header>
      <div
          class="h-full w-screen	bg-headLightBg h-screen dark:bg-headBlackBg	">
        <FunctionBar></FunctionBar>
      </div>
    </el-header>
    <el-container class="h-screen" style="height: calc(100% - 75px)">
      <el-aside width="300px"
                class="h-full	bg-asideLightBg dark:bg-asideBg resize-x min-w-min min-w-250-px max-w-500-px border-r dark:border-black">
        <IndexOperatePanel></IndexOperatePanel>
      </el-aside>
      <el-main class="h-full bg-elMainLightBg dark:bg-elMainBlackBg overflow-hidden">
        <OperationTabPanel class="h-full"></OperationTabPanel>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import FunctionBar from "@/components/FunctionBarPanel";
import IndexOperatePanel from "@/components/IndexOperatePanel";
import OperationTabPanel from "@/components/OperationTabPanel";

export default {
  /**
   * 主界面，主要处理页面结构
   */
  name: "IndexView",
  components: {
    FunctionBar: FunctionBar,
    IndexOperatePanel: IndexOperatePanel,
    OperationTabPanel: OperationTabPanel
  }
}
</script>

<style scoped>
</style>
<style>
.el-header, .el-footer {
  margin: 0;
  padding: 0;
}

.el-aside {
  color: #333;
  text-align: center;
}

.el-main {
  color: #333;
  text-align: center;
  margin: 0;
  padding: 0;
}

body > .el-container {
  margin-bottom: 40px;
}


</style>
<style>
.el-header {
  height: 75px !important;
}
/*深色*/
@media (prefers-color-scheme: dark) {
  .el-header {
    height: 75px !important;
  }
}

/*浅色*/
@media (prefers-color-scheme: light) {

}
</style>
