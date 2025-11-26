import fs from 'fs'
import path from 'path'
import { IUser } from '@/types'
export const runtime = 'nodejs'
export const getUsers = () => {
    const filePath = path.join(process.cwd(), 'src', 'db', 'user.json')
    console.log(filePath)
    const users = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(users).users
}

export const getUserById = (id: string) => {
    const users = getUsers()
    return users.find((user: IUser) => user.id === id)
}

export const addUser = (username: string, password: string) => {
    const filePath = path.join(process.cwd(), 'src', 'db', 'user.json')
    const jsonData = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(jsonData)
    data.users.push({ id: (Number(data.users[data.users.length - 1].id) + 1).toString(), username, password, avatar: "https://picsum.photos/200/300" })
    const newData = JSON.stringify(data)
    fs.writeFileSync(filePath, newData, { encoding: 'utf-8' })
    return
}