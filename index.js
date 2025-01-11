import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { turso } from './services/connection.js';
const PORT = process.env.PORT || 5000;

const app = express()
app.use(express.json())

const server = createServer(app)
const io = new Server(server)

io.on('connection', () => {
    io.emit('connection', 'Mi calol')
})


server.listen(PORT)