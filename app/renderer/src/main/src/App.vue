<template>
  <div id="app" class="dark:bg-elMainBlackBg">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){

  }
}
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
</style>
