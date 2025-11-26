import { addUser } from "@/utils/user"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
    const { username, password } = await request.json()
    addUser(username, password)
    return NextResponse.json({ code: 200, message: '注册'})
}