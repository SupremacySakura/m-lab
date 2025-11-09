'use client'

import { IModel } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ModelState {
    models: IModel[]
    setModels: (model: IModel[]) => void
}

export const useModelStore = create<ModelState>()(persist(
    (set) => {
        const setModels = (models: IModel[]) => {
            set({ models })
        }
        return {
            models: [],
            setModels
        }
    },
    { name: 'modal-store' }
))