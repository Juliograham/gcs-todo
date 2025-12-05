import { Router } from 'express'
import { db, genId } from '../models'
import { validateTodo } from '../validators'

const router = Router()

// GET /api/todos?status=all|active|completed&sort=due|created
router.get('/', (req, res) => {
  let list = [...db.todos]
  const status = typeof req.query.status === 'string' ? req.query.status : 'all'
  const sort = typeof req.query.sort === 'string' ? req.query.sort : 'created'
  if (status === 'active') list = list.filter((t) => !t.completed)
  if (status === 'completed') list = list.filter((t) => t.completed)
  if (sort === 'due') {
    list.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
  } else {
    list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
  res.json(list)
})

router.post('/', validateTodo, (req, res) => {
  const { title, description, dueDate, categoryId } = req.body
  const todo = {
    id: genId(),
    title,
    description: description || '',
    dueDate: dueDate || null,
    categoryId: categoryId || null,
    completed: false,
    createdAt: new Date().toISOString(),
  }
  db.todos.push(todo)
  res.status(201).json(todo)
})

router.get('/:id', (req, res) => {
  const t = db.todos.find((x) => x.id === req.params.id)
  if (!t) return res.status(404).json({ error: 'Todo not found' })
  res.json(t)
})

router.put('/:id', validateTodo, (req, res) => {
  const t = db.todos.find((x) => x.id === req.params.id)
  if (!t) return res.status(404).json({ error: 'Todo not found' })
  const { title, description, dueDate, categoryId, completed } = req.body
  t.title = title
  t.description = description || ''
  t.dueDate = dueDate || null
  t.categoryId = categoryId || null
  if (typeof completed === 'boolean') t.completed = completed
  t.updatedAt = new Date().toISOString()
  res.json(t)
})

router.delete('/:id', (req, res) => {
  const idx = db.todos.findIndex((x) => x.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Todo not found' })
  db.todos.splice(idx, 1)
  res.status(204).end()
})

export default router
