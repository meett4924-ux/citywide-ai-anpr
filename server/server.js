import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from './config/db.js'
import routes from './routes/index.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json())
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`[server] CityWide ANPR API running on port ${PORT}`)
  })
})
