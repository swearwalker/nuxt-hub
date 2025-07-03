import { defineStore } from 'pinia'
import type {
  TodoInterface,
  TodoNewInterface,
  TodoUpdateInterface,
} from '@/types/interfaces/todo.interface.js'
import { todoService } from '@/services/todoService.js'

export const useTodoStore = defineStore('todo', () => {
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
    } catch (error) {
      console.error(error)
    }
  }

  const createTodo = async (todo: TodoNewInterface) => {
    try {
      await todoService.createTodo(todo)
    } catch (error) {
      console.error(error)
    }
  }

  const updateTodo = async (todo: Partial<TodoUpdateInterface>) => {
    try {
      await todoService.updateTodo(todo)
    } catch (error) {
      console.error(error)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id)
    } catch (error) {
      console.error(error)
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
