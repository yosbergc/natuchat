import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

import cors from 'cors'
import { getMessages, addMessage, getMessage } from './models/mysql.js';
import { router } from './routes/userRouter.js';
const PORT = process.env.PORT || 5000;

const app = express()
app.use(cors())
app.use(express.json())

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'https://natuchat-frontend.vercel.app',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
    }
})

io.on('connection', async (socket) => {
    socket.on('chat message', async (message) => {
        const response = await addMessage(message, socket.handshake.auth.user)
        const messageFromDb = await getMessage(response.lastInsertRowid)
        io.emit('chat message', messageFromDb)
    })

    if (!socket.recovered) {
        const mensajes = await getMessages()
        io.emit('initial chat', mensajes)
    }
})

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.use('/auth', router)

server.listen(PORT)