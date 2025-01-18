import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import cors from 'cors'
import { turso } from './models/mysql.js';
const PORT = process.env.PORT || 5000;

const app = express()
app.use(cors())
app.use(express.json())

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
    }
})

io.on('connection', (socket) => {
    console.log('user connected')
    console.log(socket) 
    io.emit('connection', 'Mi calol')
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
    socket.on('chat message', (message) => {
        console.log(message)
    })
})

app.get('/', (req, res) => {
    res.send('Hello world')
})
server.listen(PORT)