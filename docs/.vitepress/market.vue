<script setup>
import { ref } from 'vue'

const isLoading = ref(true)
const isFailed = ref(false)
const data = ref([])

fetch(`https://registry.npmjs.org/-/v1/search?text=keywords:es-project-template&cacheBust=${Date.now()}`)
  .then(res => res.json())
  .then(res => data.value = res.objects
    .filter(item => item.package.name.includes('es-project-template-') || item.package.name.includes('@es-project-template'))
    .map(item => ({
      title: item.package.name.replace(/@es-project-template\//, '').replace(/es-project-template-/, ''),
      desc: item.package.description,
    })),
  )
  .catch(() => isFailed.value = true)
  .finally(() => isLoading.value = false)
</script>

<template>
  <div>
    <div align="center" mt10 md:mt20>
      <h1>模版市场</h1>
    </div>
    <div v-if="isLoading">
      <p text-center>
        加载中...
      </p>
    </div>
    <div v-if="!isFailed" grid="~ cols-1 md:cols-2 lg:cols-3 2xl:cols-4 gap-5" mt10>
      <div v-for="(item, index) in data" :key="index">
        <div cursor-pointer rounded-lg p5 border="~ 1 solid gray-700 hover:op-60" transition="all 300">
          <h4 class="m0! p0!">
            {{ item.title }}
          </h4>
          <p class="m0! p0!">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>加载失败</p>
    </div>
  </div>
</template>
