'use client'

import { useState } from 'react'
import { ILayer, IModel } from '@/types'
import { useModelStore } from '@/store/useModelStore'
import { useNotificationStore } from '@/components/Notification/Store/useNotificationStore'
import { Button, Space } from 'antd'
/**
 * 可选层
 */
const availableILayers = [
  { id: 'conv2d', type: 'Conv2D', description: '二维卷积层', parameters: { filters: 32, kernelSize: 3, activation: 'relu' } },
  { id: 'maxpool', type: 'MaxPooling2D', description: '最大池化层', parameters: { poolSize: 2 } },
  { id: 'flatten', type: 'Flatten', description: '展平层', parameters: {} },
  { id: 'dense', type: 'Dense', description: '全连接层', parameters: { units: 128, activation: 'relu' } },
  { id: 'dropout', type: 'Dropout', description: 'Dropout 层', parameters: { rate: 0.5 } },
]
/**
 * 默认模型
 */
export const defaultModel: IModel = {
  id: '0',
  name: '内置模型',
  description: '内置模型',
  createdAt: '2025-11-7 22:45:36',
  layers: availableILayers
}

enum FormMode {
  None = 'none',
  Add = 'add',
  Edit = 'edit',
}
export default function Page() {
  // 弹窗
  const { openNotificationWithIcon } = useNotificationStore()
  // 模型
  const { models, setModels } = useModelStore()
  // 修改模型的模式 无状态 ｜ 新增 ｜修改
  const [mode, setMode] = useState<FormMode>(FormMode.None)
  // 模型名
  const [modelName, setModelName] = useState('')
  // 模型描述
  const [modelDescription, setModelDescription] = useState('')
  // 模型层
  const [currentLayers, setCurrentLayers] = useState<ILayer[]>([])
  // 当前模型id
  const [currentModelId, setCurrentModelId] = useState('')
  /**
   * 添加层
   * @param ILayerType 层
   */
  const handleAddLayer = (ILayerType: string) => {
    const ILayerTemplate = availableILayers.find(l => l.id === ILayerType)
    if (ILayerTemplate) {
      const newILayer: ILayer = {
        id: `ILayer-${Date.now()}`,
        type: ILayerTemplate.type,
        parameters: { ...ILayerTemplate.parameters },
      }
      setCurrentLayers(prev => [...prev, newILayer])
    }
  }
  /**
   * 删除层
   * @param ILayerId 层id
   */
  const handleRemoveLayer = (ILayerId: string) => {
    setCurrentLayers(prev => prev.filter(l => l.id !== ILayerId))
  }
  /**
   * 开始创建模型
   */
  const handleStartAdd = () => {
    setModelName('')
    setModelDescription('')
    setCurrentLayers([])
    setMode(FormMode.Add)
    setCurrentModelId('')
  }
  /**
   * 创建模型
   * @returns 
   */
  const handleCreateModel = () => {
    if (!modelName.trim()) return
    const newModel: IModel = {
      id: `IModel-${Date.now()}`,
      name: modelName,
      description: modelDescription,
      createdAt: new Date().toISOString().split('T')[0],
      layers: currentLayers,
    }
    setModels([...models, newModel])
    handleCloseForm()
    openNotificationWithIcon('创建模型成功', '你已经成功创建模型', 'success')
  }
  /**
   * 开始修改选中模型
   * @param id 模型id
   */
  const handleStartEdit = (id: string) => {
    const model = models.find((item) => item.id === id)
    if (model) {
      setModelName(model.name)
      setModelDescription(model.description)
      setCurrentLayers(model.layers)
      setMode(FormMode.Edit)
      setCurrentModelId(id)
    }
  }
  /**
   * 修改模型
   */
  const handleEditModel = () => {
    const newModel: IModel = {
      id: currentModelId,
      name: modelName,
      description: modelDescription,
      createdAt: new Date().toISOString().split('T')[0],
      layers: currentLayers,
    }
    const newModels = [...models.filter((item) => item.id !== currentModelId), newModel]
    setModels(newModels)
    handleCloseForm()
    openNotificationWithIcon('修改模型成功', `你已经成功修改模型:${modelName}`, 'success')
  }
  /**
   * 删除模型
   * @param id 模型id
   */
  const handleDeleteModel = (id: string) => {
    const deleteModel = models.find((item) => item.id === id)
    const newModels = models.filter((item) => item.id !== id)
    setModels(newModels)
    openNotificationWithIcon('删除模型成功', `你已经成功删除模型:${deleteModel?.name}`, 'success')
  }
  /**
   * 修改模式为无状态
   */
  const handleCloseForm = () => {
    setModelName('')
    setModelDescription('')
    setCurrentLayers([])
    setCurrentModelId('')
    setMode(FormMode.None)
  }
  return (
    <div className="min-h-screen bg-background p-6 md:p-8 space-y-8">
      {/* 顶部标题栏 */}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">模型管理</h1>
            <p className="text-gray-400 mt-1">创建和管理深度学习模型结构</p>
          </div>
        </div>
        {mode === FormMode.None && (
          <Button
            onClick={() => handleStartAdd()}
            type='primary'
            className="h-10 px-6 bg-primary hover:bg-blue-600 border-none shadow-lg shadow-blue-500/20"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            }
          >
            创建新模型
          </Button>
        )}
      </div>

      {/* 模型列表 */}
      {mode === FormMode.None && (
        <div className="max-w-7xl mx-auto">
          {models.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-xl border-dashed">
              <div className="bg-[#0f1623] p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg font-medium">暂无模型数据</p>
              <button
                onClick={() => setMode(FormMode.Add)}
                className="mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition shadow-lg shadow-blue-500/20"
              >
                创建第一个模型
              </button>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {models.map(model => (
                <div
                  key={model.id}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group flex flex-col shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-[#0f1623] p-2.5 rounded-lg border border-border/50 group-hover:border-primary/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300 group-hover:text-primary transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="text"
                        size="small"
                        className="text-gray-400 hover:text-primary"
                        onClick={() => handleStartEdit(model.id)}
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        }
                      />
                      <Button
                        type="text"
                        size="small"
                        danger
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteModel(model.id)}
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        }
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-200 mb-2 truncate">{model.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">{model.description || '暂无描述'}</p>

                  <div className="mt-auto pt-4 border-t border-border flex justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0h18M5.25 12h13.5h-13.5Zm2.1 1.5.8.8 3.2-3.2" />
                      </svg>
                      {model.createdAt}
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#0f1623] px-2 py-0.5 rounded border border-border/50">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                      </svg>
                      {model.layers.length} 层结构
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 创建模型表单 */}
      {mode !== FormMode.None && (
        <div className="max-w-7xl mx-auto bg-card shadow-lg border border-border rounded-xl p-6">
          <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-200">
                {mode === FormMode.Add ? '创建新模型' : '编辑模型配置'}
              </h2>
            </div>
            <Button
              onClick={() => setMode(FormMode.None)}
              className="border-border text-gray-400 hover:text-gray-200 hover:border-gray-500"
            >
              返回列表
            </Button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">模型名称</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={e => setModelName(e.target.value)}
                  placeholder="例如: ResNet-50, VGG-16"
                  className="w-full bg-[#0B1121] border border-border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">模型描述</label>
                <input
                  value={modelDescription}
                  onChange={e => setModelDescription(e.target.value)}
                  placeholder="简要描述模型的用途和特点"
                  className="w-full bg-[#0B1121] border border-border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* 模型构建器 */}
            <div className="flex flex-col lg:flex-row gap-8 mt-8">
              {/* 可选层 */}
              <div className="flex-1 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  组件库
                </h3>
                <div className="bg-[#0f1623] border border-border rounded-xl p-4 space-y-3 h-[500px] overflow-y-auto custom-scrollbar">
                  {availableILayers.map(ILayer => (
                    <div
                      key={ILayer.id}
                      className="group bg-card border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer relative"
                      onClick={() => handleAddLayer(ILayer.id)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-gray-200 group-hover:text-primary transition-colors">{ILayer.type}</h4>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500">{ILayer.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 模型结构 */}
              <div className="flex-[2] flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  模型结构预览
                </h3>
                <div className="bg-[#0f1623] border border-border rounded-xl p-6 min-h-[500px] relative">
                  {currentLayers.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-20">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                      </svg>
                      <p className="text-sm">从左侧选择组件构建模型</p>
                    </div>
                  ) : (
                    <div className="space-y-3 relative z-10">
                      {currentLayers.map((ILayer, i) => (
                        <div key={ILayer.id} className="relative group">
                          {/* 连接线 */}
                          {i < currentLayers.length - 1 && (
                            <div className="absolute left-6 top-full h-3 w-0.5 bg-border/50 z-0"></div>
                          )}

                          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 hover:border-primary/50 transition-colors shadow-sm relative z-10">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0f1623] border border-border text-xs font-mono text-gray-400">
                              {i + 1}
                            </div>

                            <div className="flex-1">
                              <h4 className="font-bold text-gray-200 text-sm">{ILayer.type}</h4>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                {Object.entries(ILayer.parameters).map(([k, v]) => (
                                  <span key={k} className="text-xs text-gray-500">
                                    <span className="text-gray-600 mr-1">{k}:</span>
                                    <span className="text-gray-300 font-mono">{String(v)}</span>
                                  </span>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={() => handleRemoveLayer(ILayer.id)}
                              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 底部操作 */}
            <div className="flex justify-end gap-4 pt-6 border-t border-border mt-8">
              <Button
                onClick={() => handleCloseForm()}
                className="h-10 px-6 border-border text-gray-300 hover:border-gray-500"
              >
                取消
              </Button>

              {mode === FormMode.Add && (
                <Button
                  onClick={handleCreateModel}
                  type='primary'
                  className="h-10 px-8 bg-primary hover:bg-blue-600 border-none shadow-lg shadow-blue-500/20"
                >
                  创建模型
                </Button>
              )}
              {mode === FormMode.Edit && (
                <Button
                  onClick={handleEditModel}
                  type='primary'
                  className="h-10 px-8 bg-primary hover:bg-blue-600 border-none shadow-lg shadow-blue-500/20"
                >
                  保存修改
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
