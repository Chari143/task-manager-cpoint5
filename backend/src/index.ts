import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth'
import tasksRouter from './routes/tasks'

const app = express()

const PORT = Number(process.env.PORT || 4000)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

app.use(cors({ origin: FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (req, res) => res.json({ ok: true }))

app.use('/auth', authRouter)
app.use('/tasks', tasksRouter)

// app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
//   res.status(err?.status || 500).json({ message: err?.message || 'Server error' })
// })

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})