import type { TodoNewInterface, TodoUpdateInterface } from '@/types/interfaces/todo.interface.js'

export const todoService = {
  async fetchTodoList() {
    const { $api } = useNuxtApp()

    try {
      return await $api.get('/todo/list')
    } catch (error) {
      console.error('Failed to fetch todo list:', error)
      throw new Error('Failed to fetch todo list')
    }
  },

  async createTodo(todo: TodoNewInterface) {
    const { $api } = useNuxtApp()

    try {
      await $api.post('/todo/create', todo)
    } catch (error) {
      console.error('Failed to create todo:', error)
      throw new Error('Failed to create todo')
    }
  },

  async updateTodo(todo: Partial<TodoUpdateInterface>) {
    const { $api } = useNuxtApp()

    try {
      await $api.post('/todo/update', todo)
    } catch (error) {
      console.error('Failed to update todo:', error)
      throw new Error('Failed to update todo')
    }
  },

  async deleteTodo(id: number) {
    const { $api } = useNuxtApp()

    try {
      await $api.post('/todo/delete', { id })
    } catch (error) {
      console.error('Failed to delete todo:', error)
      throw new Error('Failed to delete todo')
    }
  },
}
