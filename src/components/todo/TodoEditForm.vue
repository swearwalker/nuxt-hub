<script setup lang="ts">
import type { ApiError } from '@/types/interfaces/errors.interface'
import type { TodoUpdateInterface } from '@/types/interfaces/todo.interface'
import { z } from 'zod'

const props = defineProps<{
  todoItem: TodoUpdateInterface
}>()

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'update', todo: Partial<TodoUpdateInterface>): void
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
      {{ t('todo.form.update-btn') }}
    </UButton>
    <UAlert v-if="formError" type="error">{{ formError }}</UAlert>
  </UForm>
</template>

<style scoped></style>
