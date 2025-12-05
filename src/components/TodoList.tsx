import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchTodos, deleteTodo, updateTodo } from '../features/todos/todosSlice'
import type { Todo, FetchTodosParams } from '../features/todos/todosSlice'
import { fetchCategories } from '../features/categories/categoriesSlice'
import type { RootState } from '../store'
import type { Category } from '../features/categories/categoriesSlice'
import TodoForm from './TodoForm'

export default function TodoList() {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((s: RootState) => s.todos)
  const [filter, setFilter] = useState<'all'|'active'|'completed'>('all')
  const [sort, setSort] = useState<'created'|'due'>('created')
  const [editing, setEditing] = useState<Todo | null>(null)

  useEffect(() => { dispatch(fetchTodos({ status: filter, sort } as FetchTodosParams)) }, [dispatch, filter, sort])
  useEffect(() => { dispatch(fetchCategories()) }, [dispatch])

  const categories = useAppSelector((s: RootState) => s.categories.items)

  const grouped = useMemo(() => {
    const map: Record<string, Todo[]> = {}
    for (const t of items) {
      const key = t.categoryId || 'uncategorized'
      if (!map[key]) map[key] = []
      map[key].push(t)
    }
    return map
  }, [items])

  const toggle = async (t: Todo) => {
    await dispatch(updateTodo({ id: t.id, data: { completed: !t.completed } }))
  }

  return (
    <div className="todo-list">
      <div className="controls">
        <label>Filter:
          <select value={filter} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>setFilter(e.target.value as 'all'|'active'|'completed')}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label>Sort:
          <select value={sort} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>setSort(e.target.value as 'created'|'due')}>
            <option value="created">Creation date</option>
            <option value="due">Due date</option>
          </select>
        </label>
      </div>

      <h3>Todos</h3>
      <TodoForm onDone={() => dispatch(fetchTodos({ status: filter, sort }))} />

      {loading ? <p>Loading...</p> : (
        <div>
          {/** Render grouped by categories */}
          {Object.keys(grouped).length === 0 && <p>No todos</p>}
          {Object.entries(grouped).map(([catId, list]) => {
            const cat = categories.find((c: Category) => c.id === catId)
            const title = cat ? cat.name : 'Uncategorized'
            return (
              <section key={catId} className="todo-group">
                <h4 style={{marginTop: '1rem', marginBottom: '0.5rem'}}>{title}</h4>
                <ul>
                  {list.map((t: Todo) => (
                    <li key={t.id} className={t.completed ? 'completed' : ''}>
                      <label>
                        <input type="checkbox" checked={t.completed} onChange={() => toggle(t)} />
                        Completed
                      </label>
                      <div>
                        <strong>{t.title}</strong> {t.dueDate ? <small>due {t.dueDate}</small> : null}
                        <div className="actions">
                          <button onClick={() => setEditing(t)}>Edit</button>
                          <button onClick={() => dispatch(deleteTodo(t.id))}>Delete</button>
                        </div>
                        {editing?.id === t.id ? <TodoForm initial={editing} onDone={() => { setEditing(null); dispatch(fetchTodos({ status: filter, sort } as FetchTodosParams))}} /> : null}
                        <p>{t.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
