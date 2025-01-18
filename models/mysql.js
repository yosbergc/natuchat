import dotenv from 'dotenv';
import { createClient } from "@libsql/client";
import bcrypt from 'bcrypt'
dotenv.config()

export const turso = createClient({
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_DB_TOKEN
})
await turso.execute(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    user TEXT NOT NULL
)`)
await turso.execute(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    user TEXT UNIQUE    
)`)

export async function getMessages() {
    try {
        const messages = await turso.execute("SELECT * from messages");
        return messages.rows
    } catch(error) {
        console.error(error)
    }
}
export async function addMessage(message, user) {
    const response = await turso.execute({
        sql: 'INSERT INTO messages (message, user) values (?, ?)',
        args: [message, user]
    });
    return response;
}
export async function deleteMessage(id, user) {
    try {
        const user = await turso.execute({
            sql: 'SELECT '
        })
    } catch(error) {
        console.error(error )
    }
}
export async function addUser(email, password, user) {
    try {
        const passwordEncrypted = await bcrypt.hash(password, 4)
        const response = await turso.execute({
            sql: 'INSERT INTO users (email, password, user) values (?, ?, ?)',
            args: [email, passwordEncrypted, user]
        })
        return response;
    } catch(error) {
        console.error(error)
    }
}

export async function getUserById(id) {
    try {
        const response = await turso.execute({
            sql: 'SELECT id, email, user FROM users WHERE id = ?',
            args: [id]
        })
        return response.rows[0]
    } catch (error) {
        console.error(error)
    }
}
