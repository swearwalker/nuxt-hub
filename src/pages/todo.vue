<script setup lang="ts">
import type { ApiError } from '@/types/interfaces/errors.interface'
import type {
  TodoInterface,
  TodoNewInterface,
  TodoUpdateInterface,
} from '@/types/interfaces/todo.interface'
import TodoEditForm from '@/components/todo/TodoEditForm.vue'
import TodoCreateForm from '@/components/todo/TodoCreateForm.vue'
import { useTodoStore } from '@/stores/todo/index.js'

const todoStore = useTodoStore()

const showCreateTodoModal = ref(false)
const showEditTodoModal = ref(false)

const isSubmitting = ref(false)
const formError = ref('')
const selectedTodoItem = ref<TodoUpdateInterface | null>(null)

const editTodoItem = (todo: TodoUpdateInterface) => {
  selectedTodoItem.value = todo
  showEditTodoModal.value = true
}

const createTodo = async (todo: TodoNewInterface) => {
  try {
    await todoStore.createTodo(todo)
    await refresh()
    showCreateTodoModal.value = false
  } catch (e: unknown) {
    const error = e as ApiError
    formError.value = error?.data?.message || error?.message || 'Failed to create todo'
  } finally {
    isSubmitting.value = false
  }
}

const updateTodo = async (todo: Partial<TodoUpdateInterface>) => {
  try {
    await todoStore.updateTodo(todo)
    await refresh()
    showEditTodoModal.value = false
    selectedTodoItem.value = null
  } catch (e: unknown) {
    const error = e as ApiError
    console.error('Failed to update todo item:', error)
  }
}

const deleteTodoItem = async (id: number) => {
  try {
    await todoStore.deleteTodo(id)
    todoList.value = []
    await refresh()
  } catch (e: unknown) {
    const error = e as ApiError
    console.error('Failed to delete todo item:', error)
  }
}

const toggleCreateTodoModal = () => {
  showCreateTodoModal.value = !showCreateTodoModal.value
}

const { data: todoList, refresh } = await useAsyncData<TodoInterface[]>('todoList', async () => {
  return todoStore.fetchTodoList()
})

watch(showCreateTodoModal, newValue => {
  if (!newValue) {
    selectedTodoItem.value = null
  }
})

watch(showEditTodoModal, newValue => {
  if (!newValue) {
    selectedTodoItem.value = null
  }
})
</script>

<template>
  <UContainer>
    <div class="mb-4 flex w-full">
      <UButton class="ml-auto" icon="i-lucide-plus" @click="toggleCreateTodoModal"
        >Create Todo</UButton
      >
    </div>
    <TodoTable
      :items="todoList || []"
      @update:edit="editTodoItem"
      @update:complete="updateTodo"
      @update:duplicate="createTodo"
      @update:delete="deleteTodoItem"
    />
    <UModal
      v-model:open="showCreateTodoModal"
      title="Create Todo"
      description="Fill out the form to create a new todo item."
    >
      <template #body>
        <TodoCreateForm @create="createTodo" />
      </template>
    </UModal>
    <UModal
      v-model:open="showEditTodoModal"
      title="Edit Todo"
      description="Update the todo item details"
    >
      <template #body>
        <TodoEditForm v-if="selectedTodoItem" :todo-item="selectedTodoItem" @update="updateTodo" />
      </template>
    </UModal>
  </UContainer>
</template>

<style scoped></style>
