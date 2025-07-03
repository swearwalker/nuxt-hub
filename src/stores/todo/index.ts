import { defineStore } from 'pinia'
import type {
  TodoInterface,
  TodoNewInterface,
  TodoUpdateInterface,
} from '@/types/interfaces/todo.interface.ts'
import { todoService } from '@/services/todoService.ts'
import type { ApiError } from '@/types/interfaces/errors.interface.ts'

export const useTodoStore = defineStore('todo', () => {
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
        title: 'Error',
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
        title: 'New Todo Created!',
      })
    } catch (error: unknown) {
      console.error(error)
      const apiError = error as ApiError
      toast.add({
        title: 'Error',
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
        title: 'Todo Updated!',
      })
    } catch (error: unknown) {
      console.error(error)
      const apiError = error as ApiError
      toast.add({
        title: 'Error',
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
        title: 'Todo Deleted!',
      })
    } catch (error: unknown) {
      console.error(error)
      const apiError = error as ApiError
      toast.add({
        title: 'Error',
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
