'use client'

import { defaultModel } from '@/app/model/page'
import { IExperiment, IModel, IProject } from '@/types'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button, Modal } from 'antd'
import { useModelStore } from '@/store/useModelStore'
import { useProjectStore } from '@/store/useProjectStore'
import { useNotificationStore } from '@/components/Notification/Store/useNotificationStore'

enum OpenModalType {
    Add = 'add',
    Edit = 'edit'
}

export default function Page() {
    // 弹窗
    const { openNotificationWithIcon } = useNotificationStore()
    // 项目
    const { projects, setProjects } = useProjectStore()
    // 模型
    const { models } = useModelStore()
    // 当前项目
    const [currentProject, setCurrentProject] = useState<IProject>()
    // 当前项目id
    const { id } = useParams<{ id: string }>()
    const decodedId = decodeURIComponent(id)
    // 是否已经渲染
    const [isMounted, setIsMounted] = useState(false)
    // 弹窗状态
    const [isOpen, setIsOpen] = useState<boolean>(false)
    // 弹窗模式
    const [openModalType, setOpenModalType] = useState<OpenModalType>()
    // 弹窗的实验
    const [editExperiment, setEditExperiment] = useState<IExperiment>()
    /**
     * 关闭弹窗
     */
    const handleCloseModal = () => {
        setIsOpen(false)
    }
    /**
     * 打开弹窗
     * @param type 
     */
    const handleOpenModal = (type: OpenModalType) => {
        setOpenModalType(type)
        switch (type) {
            case OpenModalType.Add:
                setExperimentName('')
                setOptimizer('SGD')
                setLearningRate(0)
                setBatchSize(0)
                setEpoch(0)
                setSetUrl('')
                setMultithreading(0)
                setWeightInit('Xavier')
                setSaveFormat('JSON+NPZ')
                setAccelerationMethod('im2col')
                setComputingResource([])
                setDescription('')
                setModel(defaultModel)
                break
            case OpenModalType.Edit:

                break
        }
        setIsOpen(true)
    }
    // 添加实验
    // 实验名
    const [experimentName, setExperimentName] = useState<string>('')
    // 优化器
    const [optimizer, setOptimizer] = useState<string>('SGD')
    // 学习率
    const [learningRate, setLearningRate] = useState<number>(0)
    // bacth size
    const [batchSize, setBatchSize] = useState<number>(0)
    // epoch
    const [epoch, setEpoch] = useState<number>(0)
    // 数据集路径
    const [setUrl, setSetUrl] = useState<string>('')
    // 多线程加载
    const [multithreading, setMultithreading] = useState<number>(0)
    // 权重初始化
    const [weightInit, setWeightInit] = useState<string>('Xavier')
    // 模型保存格式
    const [saveFormat, setSaveFormat] = useState<string>('JSON+NPZ')
    // 加速方式
    const [accelerationMethod, setAccelerationMethod] = useState<string>('im2col')
    // 计算资源
    const [computingResource, setComputingResource] = useState<string[]>([])
    // 描述
    const [description, setDescription] = useState<string>('')
    // 模型
    const [model, setModel] = useState<IModel>(defaultModel)

    /**
     * 选中计算资源
     * @param value 计算资源
     */
    const handleCheck = (value: string) => {
        setComputingResource((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value) // 取消选中
                : [...prev, value] // 选中
        )
    }
    /**
     * 添加实验
     * @param e 事件对象
     */
    const handleAddExperiment = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault()
        const experiment = {
            id: Date.now().toString(),
            name: experimentName,
            optimizer,
            learningRate,
            batchSize,
            epoch,
            setUrl,
            multithreading,
            weightInit,
            saveFormat,
            accelerationMethod,
            computingResource,
            description,
            model,
            createdAt: new Date().toLocaleString()
        }
        const newProjects = projects.map(project =>
            project.id === currentProject?.id
                ? { ...project, experiments: [...project.experiments, experiment] }
                : project)
        setProjects(newProjects)
        setExperimentName('')
        setOptimizer('SGD')
        setLearningRate(0)
        setBatchSize(0)
        setEpoch(0)
        setSetUrl('')
        setMultithreading(0)
        setWeightInit('Xavier')
        setSaveFormat('JSON+NPZ')
        setAccelerationMethod('im2col')
        setComputingResource([])
        setDescription('')
        setModel(defaultModel)
        setIsOpen(false)
        openNotificationWithIcon('创建实验成功', '你已经成功创建实验', 'success')
    }
    /**
     * 保存实验修改
     * @param e 事件对象
     */
    const handleSaveExperimentEdit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault()
        const experiment = {
            id: Date.now().toString(),
            name: experimentName,
            optimizer,
            learningRate,
            batchSize,
            epoch,
            setUrl,
            multithreading,
            weightInit,
            saveFormat,
            accelerationMethod,
            computingResource,
            description,
            model,
            createdAt: new Date().toLocaleString()
        }
        const newProjects = projects.map(project => {
            if (project.id === currentProject?.id) {
                const index = project.experiments.findIndex((item) => item.id === editExperiment?.id)
                const newProjectExperiments = [...project.experiments]
                newProjectExperiments[index] = experiment
                return { ...project, experiments: newProjectExperiments }
            }
            return project
        })
        setProjects(newProjects)
        setExperimentName('')
        setOptimizer('SGD')
        setLearningRate(0)
        setBatchSize(0)
        setEpoch(0)
        setSetUrl('')
        setMultithreading(0)
        setWeightInit('Xavier')
        setSaveFormat('JSON+NPZ')
        setAccelerationMethod('im2col')
        setComputingResource([])
        setDescription('')
        setModel(defaultModel)
        setIsOpen(false)
        openNotificationWithIcon('修改实验成功', '你已经修改创建实验', 'success')
    }
    /**
     * 删除实验
     * @param experimentId 实验id
     */
    const handleDeleteExperiment = (experimentId: string) => {
        const newProjects = projects.map(project =>
            project.id === currentProject?.id
                ? {
                    ...project,
                    experiments: project.experiments.filter(exp => exp.id !== experimentId),
                }
                : project)
        setProjects(newProjects)
        openNotificationWithIcon('删除实验成功', '你已经成功删除实验', 'success')
    }
    /**
     * 上传数据集
     * @param name 数据集名称 
     * @param e 事件对象
     */
    const handleSetTest = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
        switch (name) {
            case '训练集':
                const newProject1 = {
                    ...currentProject,
                    trainingSet: e.target.files?.[0].name || 'test'
                } as IProject
                setCurrentProject(newProject1)
                break
            case '测试集':
                const newProject2 = {
                    ...currentProject,
                    testSet: e.target.files?.[0].name || 'test'
                } as IProject
                setCurrentProject(newProject2)
                break
            case '验证集':
                const newProject3 = {
                    ...currentProject,
                    validationSet: e.target.files?.[0].name || 'test'
                } as IProject
                setCurrentProject(newProject3)
                break
        }
    }
    /**
     * 当前实验修改后映射到全局
     */
    useEffect(() => {
        if (isMounted) {
            const newProjects = projects.map(project =>
                project.id === currentProject?.id
                    ? currentProject
                    : project)
            setProjects(newProjects)
        }
    }, [currentProject])
    /**
     * 弹窗的实验修改之后映射出来
     */
    useEffect(() => {
        if (editExperiment) {
            setExperimentName(editExperiment?.name)
            setOptimizer(editExperiment.optimizer)
            setLearningRate(editExperiment.learningRate)
            setBatchSize(editExperiment.batchSize)
            setEpoch(editExperiment.epoch)
            setSetUrl(editExperiment.setUrl)
            setMultithreading(editExperiment.multithreading)
            setWeightInit(editExperiment.weightInit)
            setSaveFormat(editExperiment.saveFormat)
            setAccelerationMethod(editExperiment.accelerationMethod)
            setComputingResource(editExperiment.computingResource)
            setDescription(editExperiment.name)
            setModel(editExperiment.model)
        }
    }, [editExperiment])
    /**
     * 寻找当前项目
     */
    useEffect(() => {
        if (isMounted) {
            const project = projects?.find((item) => item.id === decodedId)
            console.log(project)
            setCurrentProject(project)
        }
    }, [projects, id])
    /**
     * 初始化
     */
    useEffect(() => {
        setIsMounted(true)
        const project = projects?.find((item) => item.id === decodedId)
        setCurrentProject(project)
    }, [])
    return (
        <div className="min-h-screen bg-background p-6 md:p-8 space-y-8 relative">
            {/* 顶部标题 */}
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-100">
                            项目配置
                        </h1>
                        <p className="text-gray-400 mt-1">{currentProject?.name}</p>
                    </div>
                </div>
                <Link href={'/project'}>
                    <Button className="border-border bg-card text-gray-300 hover:text-primary hover:border-primary">
                        返回项目列表
                    </Button>
                </Link>
            </div>

            {/* 数据集上传 */}
            <div className="max-w-7xl mx-auto bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>
                    数据集管理
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        ['训练集', currentProject?.trainingSet],
                        ['验证集', currentProject?.validationSet],
                        ['测试集', currentProject?.testSet],
                    ].map(([title, setName]) => (
                        <div key={title} className="bg-[#0f1623] border border-border p-5 rounded-lg hover:border-primary/50 transition-all group">
                            <h4 className="font-medium mb-3 text-gray-300 flex justify-between">
                                {title}
                                {setName && <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded">已上传</span>}
                            </h4>
                            <label className="cursor-pointer flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg hover:bg-card hover:border-primary transition-all group-hover:border-primary/30">
                                <input type="file" accept=".zip,.tar,.gz" className="hidden" onChange={(e) => handleSetTest(title || '训练集', e)} />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-500 mb-2 group-hover:text-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                </svg>
                                <span className="text-sm text-gray-400 group-hover:text-gray-200">点击上传文件</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-3 truncate h-5">
                                {setName || '暂无文件'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex justify-end">
                <Button
                    onClick={() => handleOpenModal(OpenModalType.Add)}
                    type='primary'
                    className="h-10 px-6 !bg-primary hover:!bg-blue-600 border-none shadow-lg shadow-blue-500/20"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    }
                >
                    新建实验任务
                </Button>
            </div>


            {/* 实验创建 */}
            <Modal open={isOpen} onCancel={handleCloseModal} footer={null} width={800} className="dark-theme-modal">
                <div className="bg-card rounded-xl shadow-none p-2 space-y-6">
                    <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-200">
                            {openModalType === OpenModalType.Add ? '创建新实验' : '编辑实验配置'}
                        </h3>
                    </div>
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">实验名称</label>
                                <input
                                    type="text"
                                    placeholder="输入实验名称"
                                    className="w-full bg-[#0B1121] border border-border rounded-md p-2 text-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-primary outline-none"
                                    value={experimentName}
                                    onChange={(e) => setExperimentName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">优化器</label>
                                <select
                                    className="w-full bg-[#0B1121] border border-border rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-primary outline-none"
                                    value={optimizer}
                                    onChange={(e) => setOptimizer(e.target.value)}
                                >
                                    <option value={'SGD'}>SGD</option>
                                    <option value={'Adam'}>Adam</option>
                                    <option value={'RMSprop'}>RMSprop</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">学习率</label>
                                <input
                                    type="number"
                                    step="0.00001"
                                    min="0"
                                    className="w-full bg-[#0B1121] border border-border rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-primary outline-none"
                                    value={learningRate}
                                    onChange={(e) => setLearningRate(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">Batch Size</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full bg-[#0B1121] border border-border rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-primary outline-none"
                                    value={batchSize}
                                    onChange={(e) => setBatchSize(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">Epoch</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full bg-[#0B1121] border border-border rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-primary outline-none"
                                    value={epoch}
                                    onChange={(e) => setEpoch(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">数据集路径</label>
                                <input
                                    type="text"
                                    placeholder="输入数据集路径"
                                    className="w-full bg-[#0B1121] border border-border rounded-md p-2 text-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-primary outline-none"
                                    value={setUrl}
                                    onChange={(e) => setSetUrl(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">多线程加载</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full bg-[#0B1121] border border-border rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-primary outline-none"
                                    value={multithreading}
                                    onChange={(e) => setMultithreading(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">权重初始化</label>
                                <select
                                    className="w-full bg-[#0B1121] border border-border rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-primary outline-none"
                                    value={weightInit}
                                    onChange={(e) => setWeightInit(e.target.value)}
                                >
                                    <option value={'Xavier'}>Xavier</option>
                                    <option value={'He'}>He</option>
                                    <option value={'Normal'}>Normal</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">模型保存格式</label>
                                <select
                                    className="w-full bg-[#0B1121] border border-border rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-primary outline-none"
                                    value={saveFormat}
                                    onChange={(e) => setSaveFormat(e.target.value)}
                                >
                                    <option value={'JSON+NPZ'}>JSON+NPZ</option>
                                    <option value={'HDF5'}>HDF5</option>
                                    <option value={'ONNX'}>ONNX</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">加速方式</label>
                                <select
                                    className="w-full bg-[#0B1121] border border-border rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-primary outline-none"
                                    value={accelerationMethod}
                                    onChange={(e) => setAccelerationMethod(e.target.value)}
                                >
                                    <option value={'im2col'}>im2col</option>
                                    <option value={'CuDNN'} >CuDNN</option>
                                    <option value={'MKL-DNN'}>MKL-DNN</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">计算资源</label>
                                <div
                                    className="flex flex-wrap gap-3 text-gray-300"

                                >
                                    {['CPU1', 'CPU2', 'GPU1', 'GPU2'].map((res) => (
                                        <label key={res} className="flex items-center gap-1">
                                            <input
                                                type="checkbox"
                                                checked={computingResource.includes(res)}
                                                onChange={() => handleCheck(res)}
                                                className="accent-primary"
                                            />
                                            {res}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">
                                    模型选择
                                </label>
                                <select
                                    className="bg-[#0B1121] border border-border rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={model?.id}
                                    onChange={(e) => {
                                        const newModel = models?.find((item) => {
                                            return item.id === e.target.value
                                        })
                                        setModel(newModel || defaultModel)
                                    }}
                                >
                                    {models?.length &&
                                        models.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">实验备注</label>
                            <textarea
                                placeholder="输入实验备注信息"
                                className="w-full bg-[#0B1121] border border-border rounded-md p-2 h-20 text-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-primary outline-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {openModalType === OpenModalType.Add ?
                            (<Button
                                type='primary'
                                onClick={(e) => handleAddExperiment(e)}
                            >
                                创建实验
                            </Button>)
                            :
                            (<Button
                                type='primary'
                                onClick={(e) => handleSaveExperimentEdit(e)}
                            >
                                保存修改
                            </Button>)
                        }
                    </form>
                </div>
            </Modal>


            {/* 实验列表 */}
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                        </svg>
                        现有实验
                        <span className="ml-3 text-sm font-normal text-gray-500 bg-border/50 px-2 py-0.5 rounded-full">
                            {currentProject?.experiments.length || 0}
                        </span>
                    </h2>
                </div>

                {currentProject?.experiments.length ? (
                    <ul className="grid grid-cols-1 gap-4">
                        {currentProject.experiments.map((experiment) => (
                            <li key={experiment.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/50 transition-all duration-300 flex flex-col md:flex-row justify-between gap-6 group">
                                {/* Details */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-lg font-bold text-gray-200 group-hover:text-primary transition-colors">{experiment.name}</h4>
                                        <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            {experiment.model.name}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">{experiment.description || '暂无描述'}</p>

                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            {experiment.optimizer}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                            LR: {experiment.learningRate}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                            Epoch: {experiment.epoch}
                                        </div>
                                        <div className="flex items-center gap-1.5 ml-auto md:ml-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            {experiment.createdAt}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                                    <Button
                                        type='text'
                                        onClick={() => {
                                            setEditExperiment(experiment)
                                            handleOpenModal(OpenModalType.Edit)
                                        }}
                                        className="text-gray-400 hover:text-gray-200"
                                    >
                                        编辑
                                    </Button>
                                    <Button
                                        type='text'
                                        danger
                                        onClick={() => handleDeleteExperiment(experiment.id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        删除
                                    </Button>
                                    <Link href={`/project/edit/${id}/${experiment.id}`}>
                                        <Button
                                            type='primary'
                                            className="bg-primary hover:bg-blue-600 border-none shadow-md shadow-blue-500/20"
                                        >
                                            进入控制台
                                        </Button>
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-xl border-dashed">
                        <div className="bg-[#0f1623] p-4 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                            </svg>
                        </div>
                        <p className="text-gray-400 text-lg font-medium">暂无实验</p>
                        <p className="text-gray-600 text-sm mt-1">请点击右上方按钮创建您的第一个实验</p>
                    </div>
                )}
            </div>
        </div>
    )
}
