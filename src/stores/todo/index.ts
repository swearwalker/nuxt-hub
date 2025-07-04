import { defineStore } from 'pinia'
import type {
  TodoInterface,
  TodoNewInterface,
  TodoUpdateInterface,
} from '@/types/interfaces/todo.interface.ts'
import { todoService } from '@/services/todoService.ts'
import type { ApiError } from '@/types/interfaces/errors.interface.ts'

export const useTodoStore = defineStore('todo', () => {
  const { t } = useI18n()
  const toast = useToast()
  const todoList = ref<TodoInterface[]>([])

  const setTodoList = (list: TodoInterface[]) => {
    todoList.value = list
  }

  const getTodoList = () => {
    return todoList.value
  }

  const fetchTodoList = async () => {
    try {
      const response = await todoService.fetchTodoList()

      setTodoList(response)

      return response
    } catch (error: unknown) {
      console.error(error)
      const apiError = error as ApiError
      toast.add({
        title: t('todo.errors.fetch'),
        description: Array.isArray(apiError.data?.message)
          ? apiError.data.message.join(', ')
          : apiError.data?.message || apiError.message || 'An error occurred',
        color: 'error',
      })
    }
  }

  const createTodo = async (todo: TodoNewInterface) => {
    try {
      await todoService.createTodo(todo)

      toast.add({
        title: t('todo.success.create'),
        color: 'success',
      })
    } catch (error: unknown) {
      console.error(error)
      const apiError = error as ApiError
      toast.add({
        title: t('todo.errors.create'),
        description: Array.isArray(apiError.data?.message)
          ? apiError.data.message.join(', ')
          : apiError.data?.message || apiError.message || 'An error occurred',
        color: 'error',
      })
    }
  }

  const updateTodo = async (todo: Partial<TodoUpdateInterface>) => {
    try {
      await todoService.updateTodo(todo)

      toast.add({
        title: t('todo.success.update'),
        color: 'success',
      })
    } catch (error: unknown) {
      console.error(error)
      const apiError = error as ApiError
      toast.add({
        title: t('todo.errors.update'),
        description: Array.isArray(apiError.data?.message)
          ? apiError.data.message.join(', ')
          : apiError.data?.message || apiError.message || 'An error occurred',
        color: 'error',
      })
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id)

      toast.add({
        title: t('todo.success.delete'),
        color: 'success',
      })
    } catch (error: unknown) {
      console.error(error)
      const apiError = error as ApiError
      toast.add({
        title: t('todo.errors.delete'),
        description: Array.isArray(apiError.data?.message)
          ? apiError.data.message.join(', ')
          : apiError.data?.message || apiError.message || 'An error occurred',
        color: 'error',
      })
    }
  }

  return {
    todoList,
    getTodoList,
    fetchTodoList,
    createTodo,
    updateTodo,
    deleteTodo,
  }
})
