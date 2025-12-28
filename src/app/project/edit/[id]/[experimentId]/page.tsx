'use client'

import { IExperiment, IProject } from '@/types'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import LineChart from '@/components/LineChart'
import Link from 'next/link'
import { getTestAccuracyOption, getTestLossOption, getTrainAccuracyOption, getTrainLossOption, getValAccuracyOption, getValLossOption } from '@/utils/random'
import { useProjectStore } from '@/store/useProjectStore'
import { useNotificationStore } from '@/components/Notification/Store/useNotificationStore'
import { Button } from 'antd'

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
        <div className="min-h-screen bg-background p-6 md:p-8 space-y-8">
            {/* 顶部标题栏 */}
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-100">
                            {experiment?.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-400">实验控制台</span>
                            <span className="text-gray-600">/</span>
                            <span className="text-sm text-primary">{project?.name}</span>
                        </div>
                    </div>
                </div>
                <Link href={`/project/edit/${id}`}>
                    <Button className="border-border bg-card text-gray-300 hover:text-primary hover:border-primary">
                        返回实验列表
                    </Button>
                </Link>
            </div>

            {/* 实验控制面板 */}
            <div className="max-w-7xl mx-auto bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                    {/* 左侧：状态指示 */}
                    <div className="flex-1 w-full lg:w-auto flex items-center gap-6">
                        <div className="flex flex-col items-center min-w-[80px]">
                            <span className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Status</span>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border`}
                                style={{
                                    borderColor: `${statusMap[status].color}30`,
                                    backgroundColor: `${statusMap[status].color}10`,
                                    color: statusMap[status].color
                                }}
                            >
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: statusMap[status].color }}></span>
                                {statusMap[status].title}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">总体进度</span>
                                <span className="font-mono text-primary">{progress.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-3 bg-[#0f1623] rounded-full overflow-hidden border border-border/50">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                >
                                    {status === Status.running && (
                                        <div className="w-full h-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 右侧：控制按钮 */}
                    <div className="flex gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8">
                        {status !== Status.running && (
                            <Button
                                type='primary'
                                onClick={() => handleStart()}
                                disabled={status === Status.finish}
                                className="h-10 px-6 bg-primary hover:bg-blue-600 border-none shadow-lg shadow-blue-500/20"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                                    </svg>
                                }
                            >
                                开始实验
                            </Button>
                        )}

                        {status === Status.running && (
                            <Button
                                danger
                                onClick={() => handleStop()}
                                className="h-10 px-6"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                                    </svg>
                                }
                            >
                                暂停实验
                            </Button>
                        )}

                        <Button
                            className="h-10 px-4 border-border text-gray-300 hover:text-primary hover:border-primary"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            }
                        >
                            下载日志
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 左侧：实验详情 */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-200 mb-5 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                            基本信息
                        </h3>
                        <div className="space-y-4">
                            <div className="group">
                                <label className="text-xs text-gray-500 block mb-1">实验 ID</label>
                                <div className="text-sm text-gray-300 font-mono bg-[#0f1623] px-3 py-2 rounded border border-border/50 truncate select-all">
                                    {experiment?.id}
                                </div>
                            </div>
                            <div className="group">
                                <label className="text-xs text-gray-500 block mb-1">创建时间</label>
                                <div className="text-sm text-gray-300 font-mono bg-[#0f1623] px-3 py-2 rounded border border-border/50">
                                    {experiment?.createdAt}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">备注</label>
                                <p className="text-sm text-gray-400 bg-[#0f1623] px-3 py-2 rounded border border-border/50 min-h-[60px]">
                                    {experiment?.description || '无备注信息'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-200 mb-5 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                            </svg>
                            配置参数
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: '模型结构', value: experiment?.model.name },
                                { label: '优化器', value: experiment?.optimizer },
                                { label: '学习率', value: experiment?.learningRate },
                                { label: 'Batch Size', value: experiment?.batchSize },
                                { label: 'Epoch', value: experiment?.epoch },
                                { label: '权重初始化', value: experiment?.weightInit },
                                { label: '多线程', value: experiment?.multithreading },
                                { label: '加速方式', value: experiment?.accelerationMethod },
                            ].map((item, i) => (
                                <div key={i} className="bg-[#0f1623] p-3 rounded border border-border/50">
                                    <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                                    <div className="text-sm text-gray-200 font-medium truncate" title={String(item.value)}>
                                        {item.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 右侧：结果可视化 */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-200 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                </svg>
                                实时监控指标
                            </h3>
                            <div className="flex gap-2">
                                <span className="flex items-center text-xs text-gray-400 bg-[#0f1623] px-2 py-1 rounded border border-border/50">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                                    Live Updates
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.map((item, idx) => (
                                <div key={idx} className="bg-[#0f1623] rounded-xl p-1 shadow-inner border border-border group hover:border-primary/30 transition-colors">
                                    <div className="flex justify-between items-center px-4 py-3 border-b border-border/30">
                                        <h4 className="text-sm font-medium text-gray-300 group-hover:text-primary transition-colors">{item.title}</h4>
                                    </div>
                                    <div className="p-2 h-[200px]">
                                        <LineChart option={item.func(Math.floor(progress / 10))} className="w-full h-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
