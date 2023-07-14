<script setup lang="ts">
function goToHistoryPage() {
  window.open('https://myactivity.google.com/product/youtube', '_blank')
}
</script>

<template>
  <main class="w-[300px] px-6 py-6 flex flex-col items-center text-center text-gray-700">
    <div class="flex items-center">
      <Logo class="w-[24px] h-[24px]" />
      <span class="ml-1 text-lg font-bold">
        YouTube History Cleanser
      </span>
    </div>

    <button class="btn btn-xl mt-4" @click="goToHistoryPage">
      Start Cleansing
    </button>
  </main>
</template>
