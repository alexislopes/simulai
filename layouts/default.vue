<script setup lang="ts"></script>

<template>
  <div class="w-full flex justify-center items-center">
    <div class="max-w-[1400px] w-full h-20 flex items-center">
      <h1
        class="px-4 w-full text-center lg:text-start lg:px-0 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent text-3xl font-black">
        minhatabela
      </h1>
    </div>
  </div>
  <div class="w-full  flex justify-center">
    <div class="max-w-[1400px] w-full">
      <slot />
    </div>
  </div>
  <footer class="text text-slate-300 flex justify-center py-8">
    minhatabela 2024 | <a href="https://alexislopes.com.br" target="_blank" class="ml-2"> alexislopes</a> </footer>
</template>

<style></style>
