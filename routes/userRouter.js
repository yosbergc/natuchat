import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getUserByUsername } from '../models/mysql.js'
import dotenv from 'dotenv'
dotenv.config()
const router = express.Router()

router.post('', async (req, res) => {
    const { user, password } = req.body

    if (!user || !password ) {
        return res.status(400).send('Petición incorrecta, necesitamos un usuario y una contraseña.')
    }
    try {
        const userFound = await getUserByUsername(user)

        if (!userFound) {
            return res.status(401).send('Usuario o contraseña incorrecta.')
        }

        const isValidPassword = await bcrypt.compare(password, userFound.password) 

        if (!isValidPassword) {
            return res.status(401).send('Usuario o contraseña incorrecta.')
        }

        const token = jwt.sign({
            id: userFound.id
        }, process.env.FRASE_SECRETA, {
            expiresIn: '7d'
        })
    
        res.json({
            id: userFound.id,
            user: userFound.user,
            token
        })

    } catch (error) {
        console.error(error)
    }
})

router.post('/register', async (req, res) => {
    const { email, password, user } = req.body
    
    if (!email || !password || !user ) {
        return res.status(400).send('Necesitamos un correo, el usuario y la contraseña para poder registrarte.')
    }

    try {
        const userFound = await getUserByUsername(user)

        if (userFound) {
            return res.status(400).send('El usuario con el que te estas intentando registrar ya existe, por favor, trata con otro.')
        }

        
    } catch (error) {
        console.error(error)
    }

    


})

export { router }