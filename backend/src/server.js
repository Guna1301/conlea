import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import chatRoutes from './routes/chat.route.js'
import { connectDB } from './lib/db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

const allowedOrigins = ['http://localhost:5173', 'https://conlea.vercel.app'];

app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true); // allow tools like Postman
        if(allowedOrigins.includes(origin)){
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use('/api/chat', chatRoutes)

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
    console.log(`http://localhost:${PORT}`)
    connectDB()
})