export type ID = string

export interface Category {
  id: ID
  name: string
  createdAt: string
}

export interface Todo {
  id: ID
  title: string
  description?: string
  dueDate?: string | null
  categoryId?: ID | null
  completed: boolean
  createdAt: string
  updatedAt?: string
}

// simple in-memory store
export const db = {
  categories: [] as Category[],
  todos: [] as Todo[],
}

export const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8)
