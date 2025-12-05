import express from 'express'
import cors from 'cors'
import todosRouter from './routes/todos'
import categoriesRouter from './routes/categories'
import { errorHandler } from './middleware/errorHandler'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/todos', todosRouter)
app.use('/api/categories', categoriesRouter)

app.use(errorHandler)

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
