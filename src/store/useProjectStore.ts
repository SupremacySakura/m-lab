'use client'

import { IProject } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProjectState {
    projects: IProject[]
    setProjects: (model: IProject[]) => void
}

export const useProjectStore = create<ProjectState>()(persist(
    (set) => {
        const setProjects = (projects: IProject[]) => {
            set({ projects })
        }
        return {
            projects: [],
            setProjects
        }
    },
    { name: 'project-store' }
))