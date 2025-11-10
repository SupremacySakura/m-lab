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
        <div className="max-w-5xl mx-auto p-8 space-y-10 relative">
            {/* 顶部标题 */}
            <div className="flex items-center justify-between border-b pb-4">
                <h1 className="text-3xl font-semibold text-gray-800">
                    项目配置 - {currentProject?.name}
                </h1>
                <Link href={'/project'}>
                    <Button>返回项目列表</Button>
                </Link>
            </div>

            {/* 数据集上传 */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <h3 className="text-2xl font-medium text-gray-700">数据集上传</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        ['训练集', currentProject?.trainingSet],
                        ['验证集', currentProject?.validationSet],
                        ['测试集', currentProject?.testSet],
                    ].map(([title, setName]) => (
                        <div key={title} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                            <h4 className="font-semibold mb-2 text-gray-800">{title}</h4>
                            <label className="cursor-pointer block text-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50">
                                <input type="file" accept=".zip,.tar,.gz" className="hidden" onChange={(e) => handleSetTest(title || '训练集', e)} />
                                <div className="text-blue-600 font-medium">选择文件</div>
                            </label>
                            <p className="text-sm text-gray-500 mt-2">{setName}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Button
                onClick={() => handleOpenModal(OpenModalType.Add)}
                type='primary'
            >
                添加实验
            </Button>


            {/* 实验创建 */}
            <Modal open={isOpen} onCancel={handleCloseModal}>
                <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                    <h3 className="text-2xl font-medium text-gray-700">实验创建</h3>
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">实验名称</label>
                                <input
                                    type="text"
                                    placeholder="输入实验名称"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={experimentName}
                                    onChange={(e) => setExperimentName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">优化器</label>
                                <select
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
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
                                <label className="block text-sm font-medium mb-1 text-gray-700">学习率</label>
                                <input
                                    type="number"
                                    step="0.00001"
                                    min="0"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={learningRate}
                                    onChange={(e) => setLearningRate(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Batch Size</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={batchSize}
                                    onChange={(e) => setBatchSize(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Epoch</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={epoch}
                                    onChange={(e) => setEpoch(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">数据集路径</label>
                                <input
                                    type="text"
                                    placeholder="输入数据集路径"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={setUrl}
                                    onChange={(e) => setSetUrl(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">多线程加载</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={multithreading}
                                    onChange={(e) => setMultithreading(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">权重初始化</label>
                                <select
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={weightInit}
                                    onChange={(e) => setWeightInit(e.target.value)}
                                >
                                    <option value={'Xavier'}>Xavier</option>
                                    <option value={'He'}>He</option>
                                    <option value={'Normal'}>Normal</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">模型保存格式</label>
                                <select
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={saveFormat}
                                    onChange={(e) => setSaveFormat(e.target.value)}
                                >
                                    <option value={'JSON+NPZ'}>JSON+NPZ</option>
                                    <option value={'HDF5'}>HDF5</option>
                                    <option value={'ONNX'}>ONNX</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">加速方式</label>
                                <select
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={accelerationMethod}
                                    onChange={(e) => setAccelerationMethod(e.target.value)}
                                >
                                    <option value={'im2col'}>im2col</option>
                                    <option value={'CuDNN'} >CuDNN</option>
                                    <option value={'MKL-DNN'}>MKL-DNN</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">计算资源</label>
                                <div
                                    className="flex flex-wrap gap-3 text-gray-700"

                                >
                                    {['CPU1', 'CPU2', 'GPU1', 'GPU2'].map((res) => (
                                        <label key={res} className="flex items-center gap-1">
                                            <input
                                                type="checkbox"
                                                checked={computingResource.includes(res)}
                                                onChange={() => handleCheck(res)}
                                                className="accent-blue-500"
                                            />
                                            {res}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    模型选择
                                </label>
                                <select
                                    className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <label className="block text-sm font-medium mb-1 text-gray-700">实验备注</label>
                            <textarea
                                placeholder="输入实验备注信息"
                                className="w-full border border-gray-300 rounded-md p-2 h-20 focus:ring-2 focus:ring-blue-500 outline-none"
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
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <h3 className="text-2xl font-medium text-gray-700">现有实验</h3>
                {currentProject?.experiments.length ? (
                    <ul className="space-y-4">
                        {currentProject.experiments.map((experiment) => (
                            <li key={experiment.id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-lg font-semibold text-gray-800">{experiment.name}</h4>
                                    <div className="space-x-2">
                                        <Button
                                            color='default'
                                            variant='filled'
                                            onClick={() => {
                                                setEditExperiment(experiment)
                                                handleOpenModal(OpenModalType.Edit)
                                            }
                                            }>编辑
                                        </Button>
                                        <Link href={`/project/edit/${id}/${experiment.id}`}>
                                            <Button
                                                color='blue'
                                                variant='filled'
                                            >查看控制面板</Button>
                                        </Link>

                                        <Button
                                            color='danger'
                                            variant='filled'
                                            onClick={() => handleDeleteExperiment(experiment.id)}>
                                            删除
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-gray-600 mt-2">{experiment.description}</p>
                                <div className="text-sm text-gray-500 mt-1">
                                    <span className="mr-4">创建时间: {experiment.createdAt}</span>
                                    <span>模型类型: {experiment.model.name}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">该项目暂无实验，请重新创建实验。</p>
                )}
            </div>
        </div>

    )
}
