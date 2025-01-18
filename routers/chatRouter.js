import express from 'express'
const router = express.Router()
import { getMessages, deleteMessage, addMessage } from '../models/mysql'

export { router }