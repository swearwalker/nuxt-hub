import type { TodoNewInterface, TodoUpdateInterface } from '@/types/interfaces/todo.interface.js'

export const todoService = {
  async fetchTodoList() {
    const response = await fetch('/api/todo/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...useRequestHeaders(['cookie']),
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch todo list')
    }

    return await response.json()
  },

  async createTodo(todo: TodoNewInterface) {
    const response = await fetch('/api/todo/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...useRequestHeaders(['cookie']),
      },
      body: JSON.stringify(todo),
    })

    if (!response.ok) {
      throw new Error('Failed to create todo')
    }
  },

  async updateTodo(todo: Partial<TodoUpdateInterface>) {
    const response = await fetch('/api/todo/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...useRequestHeaders(['cookie']),
      },
      body: JSON.stringify(todo),
    })

    if (!response.ok) {
      throw new Error('Failed to update todo')
    }
  },

  async deleteTodo(id: number) {
    const response = await fetch('/api/todo/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...useRequestHeaders(['cookie']),
      },
      body: JSON.stringify({ id }),
    })

    if (!response.ok) {
      throw new Error('Failed to delete todo')
    }
  },
}
