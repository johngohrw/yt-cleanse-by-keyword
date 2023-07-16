<script setup lang="ts">
const props = defineProps<{
  results?: number[]
}>()
const tags = ['performance', 'nice', 'test', 'coldplay', 'scientist', 'something', 'algorithms']

const resultLength = computed(() => {
  return props.results?.length || 0
})

const filteredResults = computed(() => props.results?.slice(0, 15))
const stateLabel = 'ready'
</script>

<template>
  <div class="flex flex-col items-center gap-[24px] self-stretch" p="[12px]">
    <!-- Search section -->
    <div class="w-full h-24 flex-col justify-start items-start gap-2.5 inline-flex">
      <div class="w-full h-[19px] justify-center items-center inline-flex">
        <div class="text-white text-base font-semibold">
          Search
        </div>
        <div class="grow shrink basis-0 h-[13px] rounded justify-end items-center gap-2.5 flex">
          <div class="text-stone-300 text-[11px] font-semibold">
            {{ stateLabel }}
          </div>
          <div class="w-2 h-2 bg-green-400 rounded-[11px]" />
        </div>
      </div>
      <Input type="text" placeholder="comma-separated terms" />
      <button class="w-full border-none outline-none h-[29px] px-3 py-1.5 bg-sky-500 rounded justify-center items-center gap-2.5 inline-flex">
        <span class="text-white text-sm font-semibold">
          Search
        </span>
      </button>
    </div>
    <!-- Suggestions Section -->
    <div class="w-full flex-col justify-start items-start gap-[15px] inline-flex">
      <div class="self-stretch justify-between items-center gap-1 inline-flex">
        <div class="text-white text-base font-semibold">
          Suggested Terms
        </div>
        <div class="text-stone-300 text-[11px] font-semibold">
          further refine your results
        </div>
      </div>
      <div class="self-stretch justify-start items-start gap-1 inline-flex flex-wrap">
        <div v-for="tag in tags" :key="tag" class="px-2.5 py-1 bg-slate-500 rounded-[60px] flex-col justify-center items-center inline-flex">
          <div class="text-white text-sm font-semibold">
            {{ tag }}
          </div>
        </div>
      </div>
    </div>
    <!-- Results Section -->
    <div class="w-full flex-col justify-start items-start gap-[15px] inline-flex">
      <div class="self-stretch justify-center items-center inline-flex">
        <div class="text-white text-base font-semibold">
          Results
        </div>
        <div class="grow shrink basis-0 h-[13px] rounded justify-end items-center gap-2.5 flex">
          <div class="text-stone-300 text-[11px] font-semibold">
            {{ resultLength || "no" }} items will be deleted
          </div>
        </div>
      </div>
      <div class="flex-col justify-start items-start gap-[15px] flex">
        <div class="rounded justify-start items-center inline-flex">
          <div v-for="video in filteredResults" :key="video" class="w-[35.86px] h-8 origin-top-left mr-[-14px] -rotate-6 bg-zinc-300 shadow border-black" />
          <div v-if="resultLength > 15" class="z-10 py-1 px-1.5 bg-zinc-500 rounded-[32px] flex-col justify-center items-center inline-flex">
            <div class="text-white text-xs font-semibold">
              +{{ resultLength - 15 }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Submit Section -->
    <div class="w-full flex-col justify-start items-start gap-[15px] inline-flex">
      <div class="self-stretch px-3 py-1.5 bg-red-600 rounded justify-center items-center gap-2.5 inline-flex">
        <div class="text-white text-sm font-semibold">
          Cleanse from History
        </div>
      </div>
    </div>
  </div>
</template>
