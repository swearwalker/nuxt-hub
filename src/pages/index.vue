<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <main class="main">
    <UContainer>
      <h1>Hi Index! {{ t('title') }}</h1>
    </UContainer>
  </main>
</template>

<style scoped></style>
