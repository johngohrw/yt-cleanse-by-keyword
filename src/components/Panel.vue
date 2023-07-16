<script setup lang="ts">
import Search from './Screens/Search.vue'

const state = ref(0)
const results: number[] = reactive([])

const lol = document.getElementsByTagName('span')
// eslint-disable-next-line no-console
console.log('>', lol)

function handleClick() {
  state.value += 1
  results.push(state.value)
}
</script>

<template>
  <div
    class="panel w-[400px] flex flex-col items-start text-gray-100 rounded-sm backdrop-blur bg-slate-500/50"
    transition="opacity duration-300"
  >
    <!-- header -->
    <div class="flex w-full justify-between items-center" p="y-[8px] x-[12px]">
      <div class="flex items-center">
        <Logo class="w-[22px] h-[22px]" />
        <h1 class="text-xs p-0 m-0 ml-2">
          YouTube History Cleanser
        </h1>
      </div>
      <img class="w-[9px] h-[10px]" src="../assets/icon-arrow-down.svg">
    </div>

    <!-- content -->
    <div class="w-full flex p-[12px] flex-col items-center gap-[24px] self-stretch">
      <button @click="handleClick">
        add video
      </button>
      {{ state }}
      <Search :results="results" />
    </div>
  </div>
</template>

<style>
.panel > * {
  box-sizing: border-box;
}
</style>
