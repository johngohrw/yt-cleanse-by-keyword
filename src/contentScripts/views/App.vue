<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'

const [show, toggle] = useToggle(true)
</script>

<template>
  <div class="fixed right-0 bottom-0 m-5 z-100 flex flex-col items-end font-sans select-none leading-1em">
    <Panel v-show="show" m="y-2" />
    <button
      class="flex w-16 h-16 p-3 rounded-full shadow cursor-pointer border-none"
      bg="teal-600 hover:teal-700"
      @click="toggle()"
    >
      <img class="w-full h-full" src="../../assets/ytcbk.svg">
    </button>
  </div>
</template>
