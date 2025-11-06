'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import LineChart from '@/components/LineChart'
import yxzqUtils from '@yxzq-web-resource-tools/yxzq-utils-browser'
import { getAccuracy, getOption } from '@/utils/random'
export default function Page() {
    const [file, setFile] = useState<File>()
    const [preview, setPreview] = useState<string>()
    const [accuracy, setAccuracy] = useState<number>()
    const [dishType, setDishType] = useState<string>()
    const [option, setOption] = useState({})
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files && e.target.files[0]
        if (newFile) {
            setFile(newFile)
            setPreview(URL.createObjectURL(newFile))
        }
    }
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
    }
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-8 flex flex-col items-center">
            {/* 上层：上传区域 */}
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl flex justify-between items-center mb-8 border border-blue-100">
                <label htmlFor="file-input" className="cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        id="file-input"
                        className="hidden"
                    />
                    <div className="bg-blue-50 text-blue-500 border-2 border-blue-200 hover:border-blue-400 rounded-full px-6 py-2 transition flex items-center justify-center">
                        <span className="mr-2">上传图片</span>
                    </div>
                </label>
                <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
                    onClick={handleRecognition}
                >
                    识别
                </button>
            </div>

            {/* 下层：预览 + 图表 */}
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
                {/* 左侧 */}
                <div className="bg-white shadow-lg rounded-2xl p-6 flex-1 border border-blue-100 flex flex-col items-center">
                    {preview ? (
                        <Image
                            src={preview}
                            alt="预览"
                            width={300}
                            height={300}
                            className="rounded-xl mb-4 object-cover shadow-sm"
                        />
                    ) : (
                        <div className="w-[300px] h-[300px] flex items-center justify-center text-gray-400 border-2 border-dashed border-blue-200 rounded-xl">
                            预览区域
                        </div>
                    )}
                    <div className="mt-2 text-center space-y-1">
                        <p className="text-blue-600 font-semibold">菜品类型：{dishType}</p>
                        <p className="text-gray-600">识别准确率：{accuracy}%</p>
                    </div>
                </div>

                {/* 右侧 */}
                <div className="bg-white shadow-lg rounded-2xl p-6 flex-1 border border-blue-100">
                    <h2 className="text-lg font-semibold text-blue-600 mb-4 text-center">模型训练情况</h2>
                    <LineChart option={option} />
                </div>
            </div>
        </div>

    )
}
