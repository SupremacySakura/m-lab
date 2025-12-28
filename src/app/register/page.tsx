'use client'

import React from 'react'
import { Form, Input, Button } from 'antd'
import { useRouter } from 'next/navigation'
import { useNotificationStore } from '@/components/Notification/Store/useNotificationStore'

export default function RegisterPage() {
    const router = useRouter()
    const { openNotificationWithIcon } = useNotificationStore()

    const onFinish = async (values: { username: string; password: string; confirmPassword: string }) => {
        if (values.password !== values.confirmPassword) {
            openNotificationWithIcon('注册失败', '两次输入的密码不一致', 'warning')
            return
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    password: values.password,
                }),
            })

            if (!res.ok) {
                throw new Error('注册失败')
            }

            openNotificationWithIcon('注册成功', '请使用新账号登录', 'success')
            router.push('/login')
        } catch (error) {
            openNotificationWithIcon('注册失败', '请稍后重试', 'error')
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-5 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/2 right-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="bg-card rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 md:p-10 w-[90%] max-w-[420px] min-w-[300px] animate-fadeIn border border-border/60 backdrop-blur-sm relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 border border-primary/20">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
                        创建新账号
                    </h1>
                    <p className="text-gray-400 text-sm text-center mt-2">
                        加入 M-Lab，开始您的 AI 之旅
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

                    <Form.Item
                        label={<span className="text-gray-300 font-medium">确认密码</span>}
                        name="confirmPassword"
                        rules={[{ required: true, message: '请再次输入密码' }]}
                    >
                        <Input.Password 
                            prefix={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                </svg>
                            }
                            placeholder="请再次输入密码" 
                            className="!bg-[#0f1623] !border-border !text-gray-200 placeholder:!text-gray-600 hover:!border-primary/50 focus:!border-primary !rounded-lg" 
                        />
                    </Form.Item>

                    <Form.Item className="pt-2">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full !bg-primary hover:!bg-blue-600 !border-none !h-11 !text-[15px] !font-medium !rounded-lg shadow-lg shadow-blue-500/20"
                        >
                            立即注册
                        </Button>
                    </Form.Item>
                </Form>

                <div className="mt-6 text-center text-sm text-gray-500 border-t border-border/50 pt-6">
                    已有账号？{' '}
                    <a href="/login" className="text-primary hover:text-blue-400 font-medium transition-colors">
                        去登录
                    </a>
                </div>
            </div>
        </div>
    )
}

