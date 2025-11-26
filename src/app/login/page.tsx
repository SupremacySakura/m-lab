'use client'

import { Form, Input, Button } from 'antd'
import { useRouter } from 'next/navigation'
import { useNotificationStore } from '@/components/Notification/Store/useNotificationStore'
import { useUserStore } from '@/store/useUserStore'
export default function LoginPage() {
    const router = useRouter()
    const { openNotificationWithIcon } = useNotificationStore()
    const { setUser } = useUserStore()
    const onFinish = async (values: { username: string; password: string }) => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })

            if (!res.ok) {
                throw new Error('登录失败')
            }
            const data = await res.json()
            setUser(data.data)
            openNotificationWithIcon('登录成功', '欢迎回来～', 'success')
            router.push('/')
        } catch (error) {
            openNotificationWithIcon('登录失败', '请检查用户名或密码是否正确', 'error')
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-5">
            <div className="bg-white rounded-2xl shadow-[0_4px_32px_0_rgba(0,0,0,0.1)] p-10 w-[90%] max-w-[420px] min-w-[300px] animate-fadeIn">
                <h1 className="text-[#4a6fa5] text-3xl font-bold mb-6 tracking-wide text-center">
                    账号登录
                </h1>
                <p className="text-[#4a4a4a] text-sm text-center mb-8">
                    登录后可进行菜品识别、项目配置与模型管理。
                </p>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input placeholder="请输入用户名" />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input.Password placeholder="请输入密码" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full"
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    还没有账号？{' '}
                    <a href="/register" className="text-[#4a6fa5] hover:underline">
                        去注册
                    </a>
                </div>
            </div>
        </div>
    )
}

