<script setup lang="ts">
import type { ApiError, TodoInterface, TodoUpdateInterface } from '~/types/interfaces'
import { z } from 'zod'

const props = defineProps<{
  todoItem: TodoUpdateInterface
}>()

const emit = defineEmits<{
  (e: 'update', todo: Partial<TodoInterface>): void
}>()

const state = reactive<TodoUpdateInterface>({
  id: props.todoItem.id,
  title: props.todoItem.title || '',
  description: props.todoItem.description || '',
  complete: props.todoItem.complete || false,
})

const isSubmitting = ref(false)
const formError = ref('')
const isValid = ref(false)

const schema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  complete: z.boolean().default(false),
})

watch(
  () => props.todoItem,
  newVal => {
    if (newVal) {
      state.id = newVal.id
      state.title = newVal.title || ''
      state.description = newVal.description || ''
      state.complete = newVal.complete || false
    }
  },
  { immediate: true }
)

watchEffect(() => {
  const result = schema.safeParse(state)
  isValid.value = result.success
})

const submitForm = async () => {
  formError.value = ''
  const result = schema.safeParse(state)

  if (!result.success) {
    formError.value = result.error.errors[0].message
    return
  }

  isSubmitting.value = true
  try {
    emit('update', state)
  } catch (e: unknown) {
    const error = e as ApiError
    formError.value = error?.data?.message || error?.message || 'Failed to update todo'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="flex flex-col gap-4" @submit="submitForm">
    <UFormField label="Title" name="title" required>
      <UInput v-model="state.title" placeholder="Enter todo title" class="w-full" />
    </UFormField>
    <UFormField label="Description" name="description">
      <UTextarea
        v-model="state.description"
        placeholder="Enter todo description"
        maxlength="500"
        resize="none"
        class="w-full"
      />
    </UFormField>
    <UFormField label="Complete" name="complete">
      <USwitch v-model="state.complete" :label="state.complete ? 'Complete' : 'Incomplete'" />
    </UFormField>
    <UButton
      class="self-end"
      type="submit"
      :loading="isSubmitting"
      :disabled="!isValid"
      @click.prevent="submitForm"
    >
      Update Todo
    </UButton>
    <UAlert v-if="formError" type="error">{{ formError }}</UAlert>
  </UForm>
</template>

<style scoped></style>
