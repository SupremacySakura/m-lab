'use client'

import { IUser } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
    user: IUser
    setUser: (user: IUser) => void
    logout: () => void
}

export const useUserStore = create<UserState>()(persist(
    (set) => {
        const setUser = (user: IUser) => {
            set({ user })
        }
        const logout = () => {
            set({ user: {} as IUser })
        }
        return {
            user: {} as IUser,
            setUser,
            logout
        }
    },
    { name: 'm-lab-user-store' }
))