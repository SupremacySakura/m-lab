'use client'

import { NotificationType } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NotificationState {
    initOpenNotificationWithIcon: (init: (message: string, description: string, type: NotificationType) => void) => void
    openNotificationWithIcon: (message: string, description: string, type: NotificationType) => void
}

export const useNotificationStore = create<NotificationState>()(persist(
    (set) => {
        const initOpenNotificationWithIcon = (init: (message: string, description: string, type: NotificationType) => void) => {
            set({ openNotificationWithIcon: init })
        }
        return {
            initOpenNotificationWithIcon,
            openNotificationWithIcon: () => { }
        }
    },
    { name: 'project-store' }
))