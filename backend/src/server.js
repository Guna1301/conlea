import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

app.get('/api/auth/signup', (req, res) => {
    res.send('signup Route')
})
app.get('/api/auth/login', (req, res) => {
    res.send('Login Route')
})
app.get('/api/auth/logout', (req, res) => {
    res.send('logout Route')
})

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
    console.log(`http://localhost:${PORT}`)
})