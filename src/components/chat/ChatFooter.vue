<script setup lang="ts">
const model = defineModel({ type: String, default: '' })

const emit = defineEmits<{
  (e: 'update'): void
}>()

const onSubmit = () => {
  if (model.value.trim()) {
    emit('update')
  }
}
</script>

<template>
  <UForm :state="{ model }" class="flex w-full items-center gap-4" @submit.prevent="onSubmit">
    <UFormField required name="model" class="flex-1">
      <UTextarea v-model="model" class="w-full" :maxrows="3" />
    </UFormField>
    <UButton :disabled="!model" type="submit" icon="i-lucide-send" size="xl" />
  </UForm>
</template>

<style scoped></style>
