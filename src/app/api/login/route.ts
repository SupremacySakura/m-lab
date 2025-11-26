import { IUser } from "@/types"
import { getUsers } from "@/utils/user"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
    const { username, password } = await request.json()
    const users = getUsers()
    const user = users.find((user: IUser) => user.username === username)
    if (!user) {
        return NextResponse.json({ code: 404, message: '用户不存在' }, { status: 404 })
    }
    if (user.password !== password) {
        return NextResponse.json({ code: 401, message: '密码错误' }, { status: 401 })
    }
    return NextResponse.json({ code: 200, message: '登录成功', data: user })
}