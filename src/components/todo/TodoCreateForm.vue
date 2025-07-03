<script setup lang="ts">
import type { ApiError } from '@/types/interfaces/errors.interface'
import type { TodoNewInterface } from '@/types/interfaces/todo.interface'
import { z } from 'zod'

const { t } = useI18n()

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
    <UFormField :label="t('todo.form.title')" name="title" required>
      <UInput v-model="state.title" class="w-full" />
    </UFormField>
    <UFormField :label="t('todo.form.description')" name="description">
      <UTextarea v-model="state.description" maxlength="500" resize="none" class="w-full" />
    </UFormField>
    <UFormField :label="t('todo.form.status.title')" name="complete">
      <USwitch
        v-model="state.complete"
        :label="state.complete ? t('todo.form.status.complete') : t('todo.form.status.incomplete')"
      />
    </UFormField>
    <UButton
      class="self-end"
      type="submit"
      :loading="isSubmitting"
      :disabled="!isValid"
      @click.prevent="submitForm"
    >
      {{ t('todo.form.create-btn') }}
    </UButton>
    <UAlert v-if="formError" type="error">{{ formError }}</UAlert>
  </UForm>
</template>

<style scoped></style>
