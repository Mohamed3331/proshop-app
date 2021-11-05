import express from 'express'
import cors from "cors"
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import path from 'path'

import notFoundRoute from './middleware/errorMiddleware.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

const port = process.env.PORT || 5000;

const app = express()

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(express.json());
app.use(cors())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/uploads', uploadRoutes)
app.use(notFoundRoute)

app.listen(port, function () {
    connectDB()
    console.log(`Server listening on port ${port}`)
})
