import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'

dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`)
})


