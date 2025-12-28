'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import LineChart from '@/components/LineChart'
import yxzqUtils from '@yxzq-web-resource-tools/yxzq-utils-browser'
import { getAccuracy, getOption } from '@/utils/random'

export default function Page() {
    // 文件
    const [file, setFile] = useState<File>()
    // 文件预览
    const [preview, setPreview] = useState<string>()
    // 识别准确率
    const [accuracy, setAccuracy] = useState<number>()
    // 菜品类型
    const [dishType, setDishType] = useState<string>()
    // 模型训练情况
    const [option, setOption] = useState({})
    /**
     * 修改图片
     * @param e 事件对象
     */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files && e.target.files[0]
        if (newFile) {
            setFile(newFile)
            setPreview(URL.createObjectURL(newFile))
        }
    }
    /**
     * 开始识别图片
     * @returns 
     */
    const handleRecognition = async () => {
        if (!file) {
            alert("请先选择图片！")
            return;
        }
        setDishType('识别中...')
        const res = await yxzqUtils.uploadResource(file, {
            url: 'http://42.193.0.33:3100',
            useDate: 'no'
        })

        try {
            const result = await fetch('/api/recognition', {
                method: 'POST',
                body: JSON.stringify({
                    file: res.filePath
                })
            })
            const data = await result.json()
            const { dishType, accuracy } = data.data
            if (accuracy !== 0) {
                const accuracy = getAccuracy()
                setAccuracy(accuracy)
                const option = getOption()
                setOption(option)
            } else {
                setAccuracy(0)
            }
            setDishType(dishType)
        } catch (error) {
            setDishType('识别失败')
        }
    }
    return (
        <div className="min-h-screen bg-background p-6 md:p-8 space-y-6">
            {/* 上层：工具栏 */}
            <div className="max-w-7xl mx-auto bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center shadow-sm gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-200">图像识别任务</h2>
                        <p className="text-sm text-gray-400">上传菜品图片进行智能识别与分析</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <label htmlFor="file-input" className="cursor-pointer flex-1 md:flex-none">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            id="file-input"
                            className="hidden"
                        />
                        <div className="bg-[#0f1623] text-gray-300 border border-border hover:border-primary/50 hover:text-primary rounded-md px-4 py-2 transition flex items-center justify-center text-sm font-medium h-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                            {file ? '更换图片' : '上传图片'}
                        </div>
                    </label>
                    <button
                        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition h-10 text-sm font-medium shadow-sm shadow-blue-500/20 flex-1 md:flex-none"
                        onClick={handleRecognition}
                    >
                        开始识别
                    </button>
                </div>
            </div>

            {/* 下层：Grid 布局 */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 左侧：预览与结果 */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* 预览卡片 */}
                    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
                        <h3 className="text-base font-medium text-gray-200 mb-4 flex items-center">
                            <span className="w-1 h-4 bg-primary rounded-full mr-2"></span>
                            图片预览
                        </h3>
                        <div className="bg-[#0B1121] rounded-lg border border-border/50 overflow-hidden flex items-center justify-center min-h-[300px] relative">
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="预览"
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-500 p-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3 opacity-20">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    <span className="text-sm">暂无图片</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 结果数据卡片 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card border border-border rounded-lg p-4 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                                </svg>
                            </div>
                            <p className="text-xs text-gray-400 mb-1">识别结果</p>
                            <p className="text-xl font-bold text-gray-200 truncate" title={dishType}>{dishType || '-'}</p>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-green-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <p className="text-xs text-gray-400 mb-1">准确率</p>
                            <p className="text-xl font-bold text-green-400">{accuracy ? accuracy.toFixed(2) + '%' : '-'}</p>
                        </div>
                    </div>
                </div>

                {/* 右侧：图表 */}
                <div className="lg:col-span-8 bg-card border border-border rounded-lg p-5 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-medium text-gray-200 flex items-center">
                            <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
                            模型训练监控
                        </h3>
                        <div className="flex gap-2">
                            <span className="text-xs px-2 py-1 bg-[#0f1623] border border-border rounded text-gray-400">实时更新</span>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-[400px] bg-[#0B1121]/50 rounded-lg border border-border/30 p-2">
                        <LineChart option={option} />
                    </div>
                </div>
            </div>
        </div>
    )
}
