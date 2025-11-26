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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-5">
            <div className="bg-white rounded-2xl shadow-[0_4px_32px_0_rgba(0,0,0,0.1)] p-10 w-[90%] max-w-[420px] min-w-[300px] animate-fadeIn">
                <h1 className="text-[#4a6fa5] text-3xl font-bold mb-6 tracking-wide text-center">
                    注册新账号
                </h1>
                <p className="text-[#4a4a4a] text-sm text-center mb-8">
                    注册后即可使用系统的菜品识别、项目与模型管理功能。
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

                    <Form.Item
                        label="确认密码"
                        name="confirmPassword"
                        rules={[{ required: true, message: '请再次输入密码' }]}
                    >
                        <Input.Password placeholder="请再次输入密码" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full"
                        >
                            注册
                        </Button>
                    </Form.Item>
                </Form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    已有账号？{' '}
                    <a href="/login" className="text-[#4a6fa5] hover:underline">
                        去登录
                    </a>
                </div>
            </div>
        </div>
    )
}

