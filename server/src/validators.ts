import { Request, Response, NextFunction } from 'express'

export function validateCategory(req: Request, res: Response, next: NextFunction) {
  const { name } = req.body
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required for category' })
  }
  next()
}

export function validateTodo(req: Request, res: Response, next: NextFunction) {
  const { title, dueDate, categoryId } = req.body
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required for todo' })
  }
  if (dueDate && isNaN(Date.parse(dueDate))) {
    return res.status(400).json({ error: 'Invalid dueDate' })
  }
  if (categoryId && typeof categoryId !== 'string') {
    return res.status(400).json({ error: 'Invalid categoryId' })
  }
  next()
}
