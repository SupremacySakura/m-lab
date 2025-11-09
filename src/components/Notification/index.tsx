'use client'

import { useEffect } from 'react'
import { notification } from 'antd'
import { NotificationType } from '@/types'
import { useNotificationStore } from './Store/useNotificationStore'


export default function Notification() {
    const [api, contextHolder] = notification.useNotification()
    const { initOpenNotificationWithIcon } = useNotificationStore()

    useEffect(() => {
        const openNotificationWithIcon = (message: string, description: string, type: NotificationType) => {
            api[type]({
                message,
                description,
            })
        }
        initOpenNotificationWithIcon(openNotificationWithIcon)
    }, [])

    return (
        <>
            {contextHolder}
        </>
    )
}
