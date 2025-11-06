import { NextRequest, NextResponse } from "next/server"
import { recognition } from "@/utils/ai"
export const POST = async (request: NextRequest) => {
    const { file } = await request.json()
    if (!file) {
        return NextResponse.json({ error: "缺少有效文件" }, { status: 400 })
    }
    const result = await recognition(file)
    return NextResponse.json({
        code: 200,
        message: '成功',
        data: result
    })
}