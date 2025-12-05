import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import api from '../../lib/api'

export interface Todo {
  id: string
  title: string
  description?: string
  dueDate?: string | null
  categoryId?: string | null
  completed: boolean
  createdAt: string
}

interface TodosState {
  items: Todo[]
  loading: boolean
  error?: string | null
}

const initialState: TodosState = { items: [], loading: false, error: null }

export type FetchTodosParams = { status?: 'all' | 'active' | 'completed'; sort?: 'due' | 'created'; categoryId?: string }

export const fetchTodos = createAsyncThunk('todos/fetch', async (params?: FetchTodosParams) => {
  const res = await api.get('/todos', { params })
  return res.data as Todo[]
})

export type CreateTodoPayload = {
  title: string
  description?: string
  dueDate?: string | null
  categoryId?: string | null
}

export const addTodo = createAsyncThunk('todos/add', async (payload: CreateTodoPayload) => {
  const res = await api.post('/todos', payload)
  return res.data as Todo
})

export type UpdateTodoPayload = { id: string; data: Partial<CreateTodoPayload & { completed?: boolean; title?: string }> }

export const updateTodo = createAsyncThunk('todos/update', async ({ id, data }: UpdateTodoPayload) => {
  const res = await api.put(`/todos/${id}`, data)
  return res.data as Todo
})

export const deleteTodo = createAsyncThunk('todos/delete', async (id: string) => {
  await api.delete(`/todos/${id}`)
  return id
})

const slice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTodos.pending, (s) => { s.loading = true })
      .addCase(fetchTodos.fulfilled, (s, a: PayloadAction<Todo[]>) => { s.loading = false; s.items = a.payload })
      .addCase(fetchTodos.rejected, (s, a) => { s.loading = false; s.error = a.error.message })
      .addCase(addTodo.fulfilled, (s, a: PayloadAction<Todo>) => { s.items.unshift(a.payload) })
      .addCase(updateTodo.fulfilled, (s, a: PayloadAction<Todo>) => {
        const idx = s.items.findIndex((t) => t.id === a.payload.id)
        if (idx !== -1) s.items[idx] = a.payload
      })
      .addCase(deleteTodo.fulfilled, (s, a: PayloadAction<string>) => {
        s.items = s.items.filter((t) => t.id !== a.payload)
      })
  }
})

export default slice.reducer
