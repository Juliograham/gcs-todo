import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { addTodo, updateTodo } from '../features/todos/todosSlice'
import type { Todo } from '../features/todos/todosSlice'
import { fetchCategories } from '../features/categories/categoriesSlice'
import type { RootState } from '../store'
import type { Category } from '../features/categories/categoriesSlice'

type Props = {
  initial?: Todo | null
  onDone?: () => void
}

export default function TodoForm({ initial, onDone }: Props) {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [dueDate, setDueDate] = useState(initial?.dueDate || '')
  const [categoryId, setCategoryId] = useState<string | null>(initial?.categoryId ?? null)
  const categories = useAppSelector((s: RootState) => s.categories.items as Category[])

  useEffect(() => {
    if (!categories || categories.length === 0) dispatch(fetchCategories())
  }, [dispatch, categories])

  const handleClear = () => {
    setTitle('')
    setDescription('')
    setDueDate('')
    setCategoryId(null)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { title, description, dueDate, categoryId }
    if (initial?.id) {
      await dispatch(updateTodo({ id: initial.id, data: payload }))
    } else {
      await dispatch(addTodo(payload))
    }
    handleClear()
    onDone && onDone()
  }

  return (
    <form onSubmit={submit} className="todo-form">
      <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" />
      <input type="date" value={dueDate || ''} onChange={(e)=>setDueDate(e.target.value)} />
      <select value={categoryId ?? ''} onChange={(e)=>setCategoryId(e.target.value || null)}>
        <option value="">Uncategorized</option>
        {categories && categories.map((c: Category) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
      </select>
      <button type="submit">{initial?.id ? 'Update' : 'Add'} Todo</button>
    </form>
  )
}
