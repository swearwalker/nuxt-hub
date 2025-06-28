<script setup lang="ts">
import DefaultSidebar from '~/components/layout/DefaultSidebar.vue'
</script>

<template>
  <div class="flex">
    <DefaultSidebar />
    <main class="flex-1 py-2">
      <slot />
    </main>
  </div>
</template>

<style scoped></style>
