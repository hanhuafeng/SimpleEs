<template>
  <div class="flex flex-row grid grid-cols-3 rounded-md	w-full select-none">
    <div class="rounded-l-xl h-full flex flex-col items-center justify-center select-none" :class="bgColor">
      <img :src="icon" alt="" :class="animate" width="80%" height="80%" style="object-fit: cover;padding: 10%"
           class="select-none">
    </div>
    <div class="col-span-2 flex flex-col grid-rows-3 bg-white w-full rounded-r-xl p-2 dark:bg-headBlackBg">
      <div class="text-left	row-span-2 select-none">
        <div class="truncate text-3xl sm:text-xs md:text-sm lg:text-3xl animate-pulse dark:text-white tracking-tighter"
             style="font-family: LCD,serif" :title="num">
          {{ num.replaceAll('KB', '').replaceAll('GB', '').replaceAll('MB', '') }}<a class=""
                                                                                      v-if="num.indexOf('GB')!==-1 ">gb</a><a
            class="" v-else-if="num.indexOf('KB')!==-1">kb</a><a
            class="" v-else-if="num.indexOf('MB') !==-1">mb</a>
        </div>
      </div>
      <div class="text-left w-full select-none">
        <div class="text-gray-400 truncate sm:text-xs md:text-sm lg:text-base" :title="describe">{{ describe }}</div>
        <div class="text-gray-400 truncate sm:text-xs md:text-sm lg:text-base" :title="describe">{{ endDescribe }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseDataCard",
  props: ['icon', 'animate', 'num', 'describe', 'endDescribe', 'bgColor']
}
</script>

<style scoped>

</style>
