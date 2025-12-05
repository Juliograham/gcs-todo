import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchCategories, addCategory } from '../features/categories/categoriesSlice'
import type { Category } from '../features/categories/categoriesSlice'
import type { RootState } from '../store'
import type { Todo } from '../features/todos/todosSlice'

export default function CategoryList() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((s: RootState) => s.categories.items as Category[])
  const todos = useAppSelector((s: RootState) => s.todos.items as Todo[])
  const [name, setName] = useState('')

  useEffect(() => { dispatch(fetchCategories()) }, [dispatch])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    await dispatch(addCategory({ name }))
    setName('')
  }

  const uncategorizedCount = todos ? todos.filter((t: Todo) => !t.categoryId).length : 0

  return (
    <div className="category-list">
      <h3>Categories</h3>
      <ul>
        <li key="uncat" className="category-item">
          <span className="cat-name">Uncategorized</span>
          <span className="category-badge">{uncategorizedCount}</span>
        </li>
        {categories.map((c: Category) => {
          const count = todos ? todos.filter((t: Todo) => t.categoryId === c.id).length : 0
          return (
            <li key={c.id} className="category-item">
              <span className="cat-name">{c.name}</span>
              <span className="category-badge">{count}</span>
            </li>
          )
        })}
      </ul>
      <form onSubmit={submit}>
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="New category" />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}
