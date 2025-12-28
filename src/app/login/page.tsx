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
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-5 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="bg-card rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 md:p-10 w-[90%] max-w-[420px] min-w-[300px] animate-fadeIn border border-border/60 backdrop-blur-sm relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 border border-primary/20">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
                        欢迎回来
                    </h1>
                    <p className="text-gray-400 text-sm text-center mt-2">
                        登录 M-Lab 以继续您的工作
                    </p>
                </div>

                <Form layout="vertical" onFinish={onFinish} size="large" className="space-y-2">
                    <Form.Item
                        label={<span className="text-gray-300 font-medium">用户名</span>}
                        name="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input
                            prefix={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            }
                            placeholder="请输入用户名"
                            className="!bg-[#0f1623] !border-border !text-gray-200 placeholder:!text-gray-600 hover:!border-primary/50 focus:!border-primary !rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-300 font-medium">密码</span>}
                        name="password"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input.Password
                            prefix={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            }
                            placeholder="请输入密码"
                            className="!bg-[#0f1623] !border-border !text-gray-200 placeholder:!text-gray-600 hover:!border-primary/50 focus:!border-primary !rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item className="pt-2">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full !bg-primary hover:!bg-blue-600 !border-none !h-11 !text-[15px] !font-medium !rounded-lg shadow-lg shadow-blue-500/20"
                        >
                            立即登录
                        </Button>
                    </Form.Item>
                </Form>

                <div className="mt-6 text-center text-sm text-gray-500 border-t border-border/50 pt-6">
                    还没有账号？{' '}
                    <a href="/register" className="text-primary hover:text-blue-400 font-medium transition-colors">
                        注册新账号
                    </a>
                </div>
            </div>
        </div>
    )
}

