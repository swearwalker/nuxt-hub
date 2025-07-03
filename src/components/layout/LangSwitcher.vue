<script setup>
const { t, locale: currentLocale, locales, setLocale } = useI18n()

const formattedLocales = computed(() => {
  return locales.value.map(locale => ({
    code: locale.code,
    name: t(`sidebar.language.${locale.code}`),
  }))
})

const selectedLocale = computed({
  get() {
    return currentLocale.value || 'uk'
  },
  set(value) {
    currentLocale.value = value
    setLocale(value)
  },
})
</script>

<template>
  <USelect
    v-model="selectedLocale"
    class="w-full"
    :items="formattedLocales"
    value-key="code"
    label-key="name"
  />
</template>
