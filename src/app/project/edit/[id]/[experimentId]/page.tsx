'use client'

import { IExperiment, IProject } from '@/types'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import LineChart from '@/components/LineChart'
import Link from 'next/link'
import { getTestAccuracyOption, getTestLossOption, getTrainAccuracyOption, getTrainLossOption, getValAccuracyOption, getValLossOption } from '@/utils/random'
import { useProjectStore } from '@/store/useProjectStore'
import { useNotificationStore } from '@/components/Notification/Store/useNotificationStore'

// 定时器
let interval: number | NodeJS.Timeout = -1

// 状态
enum Status {
    waitStart = 'waitStart',
    running = 'running',
    stop = 'stop',
    finish = 'finish'
}

export default function Page() {
    // 弹窗
    const { openNotificationWithIcon } = useNotificationStore()
    // 项目id 与 实验id
    const { id, experimentId } = useParams<{ id: string, experimentId: string }>()
    const decodedId = decodeURIComponent(id)
    // 项目
    const { projects } = useProjectStore()
    // 当前项目
    const [project, setProject] = useState<IProject>()
    // 当前实验
    const [experiment, setExperiment] = useState<IExperiment>()
    // 进度
    const [progress, setProgress] = useState(0)
    // 状态
    const [status, setStatus] = useState<Status>(Status.waitStart)
    // 实验数据
    const data = [
        { title: '训练集损失', func: getTrainLossOption },
        { title: '训练集准确率', func: getTrainAccuracyOption },
        { title: '验证集损失', func: getValLossOption },
        { title: '验证集准确率', func: getValAccuracyOption },
        { title: '测试集损失', func: getTestLossOption },
        { title: '测试集准确率', func: getTestAccuracyOption },
    ]
    // 状态map
    const statusMap = {
        [Status.waitStart]: {
            title: '待开始',
            color: '#FF9800'
        },
        [Status.running]: {
            title: '进行中',
            color: '#2196F3'
        },
        [Status.stop]: {
            title: '已暂停',
            color: '#F44336'
        },
        [Status.finish]: {
            title: '已完成',
            color: '#4CAF50'
        }
    }
    /**
     * 开始实验
     */
    const handleStart = () => {
        setStatus(Status.running)
        interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + Math.random() * 5
                if (newProgress >= 100) {
                    clearInterval(interval)
                    interval = -1
                    setStatus(Status.finish)
                    return 100
                }
                return newProgress
            })
        }, 500)
    }
    /**
     * 暂停实验
     * @returns 
     */
    const handleStop = () => {
        if (progress === 100 || progress === 0) {
            return
        }
        if (interval !== -1) {
            clearInterval(interval)
            setStatus(Status.stop)
            interval = -1
        }
        openNotificationWithIcon('实验暂停', '实验已暂停', 'info')
    }
    /**
     * 项目id 或 项目 变动时 修改当前项目
     */
    useEffect(() => {
        const nowProject = projects.find((item) => item.id === decodedId)
        setProject(nowProject)
    }, [projects, decodedId])
    /**
     * 当前项目 或 实验id 变动时 修改当前实验
     */
    useEffect(() => {
        const nowExperiment = project?.experiments.find((item) => item.id === experimentId)
        setExperiment(nowExperiment)
    }, [project, experimentId])

    return (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen text-gray-800">
            {/* 顶部标题栏 */}
            <div className="flex justify-between items-center mb-8 border-b border-blue-200 pb-3">
                <h2 className="text-2xl font-bold text-blue-700">{experiment?.name}</h2>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                >
                    <Link href={`/project/edit/${id}`}>返回实验列表</Link>
                </button>
            </div>

            {/* 实验控制面板 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">实验控制面板</h3>

                {/* 状态与进度 */}
                <div className="flex items-center gap-6 mb-6">
                    <div className="flex flex-col items-center">
                        <span className="text-sm text-gray-600">状态</span>
                        <div className="w-3 h-3 rounded-full mt-1" style={{ backgroundColor: statusMap[status].color }}></div>
                        <div>
                            {statusMap[status].title}
                        </div>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                        <span className="text-sm text-gray-600">进度 : {progress.toFixed(2)} %</span>
                        <div className="w-full h-2 bg-blue-100 rounded-full mt-1">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* 控制按钮 */}
                <div className="flex gap-4">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                        onClick={() => handleStart()}>
                        开始
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-sm"
                        onClick={() => handleStop()}>
                        停止
                    </button>
                    <button className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition shadow-sm">
                        下载结果
                    </button>
                </div>
            </div>

            {/* 实验详情 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">实验详情</h3>

                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div><span className="font-medium text-gray-700">项目ID:</span> {project?.id}</div>
                    <div><span className="font-medium text-gray-700">实验ID:</span> {experiment?.id}</div>
                    <div><span className="font-medium text-gray-700">创建时间:</span> {experiment?.createdAt}</div>
                    <div><span className="font-medium text-gray-700">模型:</span> {experiment?.model.name}</div>
                    <div><span className="font-medium text-gray-700">优化器:</span> {experiment?.optimizer}</div>
                    <div><span className="font-medium text-gray-700">学习率:</span> {experiment?.learningRate}</div>
                    <div><span className="font-medium text-gray-700">Batch Size:</span> {experiment?.batchSize}</div>
                    <div><span className="font-medium text-gray-700">Epoch:</span> {experiment?.epoch}</div>
                    <div><span className="font-medium text-gray-700">数据集路径:</span> {experiment?.setUrl}</div>
                    <div><span className="font-medium text-gray-700">多线程加载:</span> {experiment?.multithreading}</div>
                    <div><span className="font-medium text-gray-700">权重初始化:</span> {experiment?.weightInit}</div>
                    <div><span className="font-medium text-gray-700">模型保存格式:</span> {experiment?.saveFormat}</div>
                    <div><span className="font-medium text-gray-700">加速方式:</span> {experiment?.accelerationMethod}</div>
                    <div><span className="font-medium text-gray-700">计算资源:</span> {experiment?.computingResource}</div>
                </div>

                <div className="mt-4 text-sm text-gray-700">
                    <span className="font-medium text-gray-700">实验备注：</span>
                    {experiment?.description ? (
                        <span>{experiment.description}</span>
                    ) : (
                        <div className="text-gray-400">无备注</div>
                    )}
                </div>
            </div>

            {/* 实验结果可视化 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">实验结果可视化</h3>

                <div className="grid grid-cols-2 gap-6">
                    {data.map((item, idx) => (
                        <div key={idx} className="bg-blue-50 rounded-xl p-4 shadow-inner">
                            <h4 className="text-md font-semibold text-blue-700 mb-2">{item.title}</h4>
                            <div className="bg-white rounded-lg shadow p-2">
                                <LineChart option={item.func(Math.floor(progress / 10))}></LineChart>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}
