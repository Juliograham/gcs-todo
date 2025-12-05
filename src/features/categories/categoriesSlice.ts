import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import api from '../../lib/api'

export interface Category {
  id: string
  name: string
}

interface CategoriesState {
  items: Category[]
  loading: boolean
}

const initialState: CategoriesState = { items: [], loading: false }

export const fetchCategories = createAsyncThunk('categories/fetch', async () => {
  const res = await api.get('/categories')
  return res.data as Category[]
})

export type CreateCategoryPayload = { name: string }

export const addCategory = createAsyncThunk('categories/add', async (payload: CreateCategoryPayload) => {
  const res = await api.post('/categories', payload)
  return res.data as Category
})

const slice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (s) => { s.loading = true })
      .addCase(fetchCategories.fulfilled, (s, a: PayloadAction<Category[]>) => { s.loading = false; s.items = a.payload })
      .addCase(addCategory.fulfilled, (s, a: PayloadAction<Category>) => { s.items.push(a.payload) })
  }
})

export default slice.reducer
