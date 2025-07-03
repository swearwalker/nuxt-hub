<script setup>
const { t } = useI18n()
const colorMode = useColorMode()

const options = ref([
  { label: t('sidebar.theme.light'), value: 'light', icon: 'i-lucide-sun' },
  { label: t('sidebar.theme.dark'), value: 'dark', icon: 'i-lucide-moon' },
])

const selectedTheme = computed({
  get() {
    return colorMode.value || 'dark'
  },
  set(value) {
    colorMode.preference = value
  },
})
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <USelect v-model="selectedTheme" class="w-full" :items="options" />
  </ClientOnly>
</template>
