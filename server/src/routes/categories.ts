import { Router } from 'express'
import { db, genId } from '../models'
import { validateCategory } from '../validators'

const router = Router()

router.get('/', (req, res) => {
  res.json(db.categories)
})

router.post('/', validateCategory, (req, res) => {
  const { name } = req.body
  const existing = db.categories.find((c) => c.name === name)
  if (existing) return res.status(400).json({ error: 'Category already exists' })
  const cat = { id: genId(), name, createdAt: new Date().toISOString() }
  db.categories.push(cat)
  res.status(201).json(cat)
})

export default router
