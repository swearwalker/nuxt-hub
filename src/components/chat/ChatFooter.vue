<script setup lang="ts">
const model = defineModel({ type: String, default: '' })
const textareaRef = ref<HTMLElement>()

const emit = defineEmits<{
  (e: 'update'): void
}>()

const onSubmit = () => {
  if (model.value.trim()) {
    emit('update')
  }
}

useChatSubmit(textareaRef, onSubmit)
</script>

<template>
  <UForm :state="{ model }" class="flex w-full items-center gap-4" @submit.prevent="onSubmit">
    <UFormField required name="model" class="flex-1">
      <UTextarea ref="textareaRef" v-model="model" class="w-full" :maxrows="3" />
    </UFormField>
    <UButton :disabled="!model" type="submit" icon="i-lucide-send" size="xl" />
  </UForm>
</template>

<style scoped></style>
