'use client'
import React from 'react'

interface IParams {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

export default function Modal({ isOpen, onClose, children }: IParams) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/80 bg-opacity-50 flex justify-center items-center h-full z-50"
        >
            <div
                className="bg-white p-6 rounded-lg max-w-4xl w-full h-3/4 overflow-y-auto"
            >
                <div>{children}</div>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={onClose}
                >
                    关闭
                </button>
            </div>
        </div>
    )
}
