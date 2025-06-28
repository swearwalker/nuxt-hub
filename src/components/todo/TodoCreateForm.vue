<script setup lang="ts">
import type { ApiError, TodoNewInterface } from '~/types/interfaces'
import { z } from 'zod'

const emit = defineEmits<{
  (e: 'create', todo: TodoNewInterface): void
}>()

const state = reactive<TodoNewInterface>({
  title: '',
  description: '',
  complete: false,
})

const isSubmitting = ref(false)
const formError = ref('')
const isValid = ref(false)

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  complete: z.boolean().default(false),
})

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
    emit('create', state)
    state.title = ''
    state.description = ''
    state.complete = false
  } catch (e: unknown) {
    const error = e as ApiError
    formError.value = error?.data?.message || error?.message || 'Failed to create todo'
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
      Create Todo
    </UButton>
    <UAlert v-if="formError" type="error">{{ formError }}</UAlert>
  </UForm>
</template>

<style scoped></style>
