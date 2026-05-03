import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import authRoutes from './routes/auth.routes'

dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

const PORT: number = Number(process.env.PORT) || 5000

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`)
})


