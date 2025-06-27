<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
</script>

<template>
  <main class="main">
    <UContainer>
      <h1>Hi Auth! {{ t('title') }}</h1>
    </UContainer>
  </main>
</template>

<style scoped></style>
