import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(5001,()=>{
    console.log('server is running on port 5001')
    console.log('http://localhost:5001')
})