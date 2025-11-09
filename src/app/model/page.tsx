'use client'

import { useState } from 'react'
import { ILayer, IModel } from '@/types'
import { useModelStore } from '@/store/useModelStore'
import { useNotificationStore } from '@/components/Notification/Store/useNotificationStore'

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
    openNotificationWithIcon('修改模型成功', '你已经成功修改模型', 'success')
  }
  /**
   * 开始修改选中层
   * @param id 层id
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
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">模型管理</h1>
        <button
          onClick={() => setMode(FormMode.Add)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition"
        >
          创建新模型
        </button>
      </div>

      {/* 模型列表 */}
      {mode === FormMode.None && (
        <div>
          {models.length === 0 ? (
            <div className="text-center bg-gray-50 p-10 rounded-lg text-gray-500">
              <p>暂无模型数据</p>
              <button
                onClick={() => setMode(FormMode.Add)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                创建第一个模型
              </button>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {models.map(model => (
                <div
                  key={model.id}
                  className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{model.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{model.description}</p>
                  <div className="flex justify-between text-gray-400 text-xs mb-4">
                    <span>创建日期: {model.createdAt}</span>
                    <span>层数: {model.layers.length}</span>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => handleStartEdit(model.id)}
                      className="text-blue-500 border border-blue-400 px-3 py-1 rounded-md text-sm hover:bg-blue-50 transition"
                    >
                      配置
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 创建模型表单 */}
      {mode !== FormMode.None && (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">创建新模型</h2>
            <button
              onClick={() => setMode(FormMode.None)}
              className="text-gray-500 hover:text-gray-800 transition text-sm"
            >
              返回列表
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">模型名称</label>
              <input
                type="text"
                value={modelName}
                onChange={e => setModelName(e.target.value)}
                placeholder="输入模型名称"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">模型描述</label>
              <textarea
                value={modelDescription}
                onChange={e => setModelDescription(e.target.value)}
                placeholder="输入模型描述"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 min-h-[100px]"
              />
            </div>
          </div>

          {/* 模型构建器 */}
          <div className="flex flex-col md:flex-row gap-6 my-6">
            {/* 可选层 */}
            <div className="flex-1 border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-semibold mb-3 text-gray-700">可选层</h3>
              <div className="space-y-3">
                {availableILayers.map(ILayer => (
                  <div
                    key={ILayer.id}
                    className="border border-gray-200 rounded-md p-3 hover:shadow-sm transition"
                  >
                    <h4 className="font-medium text-gray-800">{ILayer.type}</h4>
                    <p className="text-sm text-gray-500 mb-2">{ILayer.description}</p>
                    <button
                      onClick={() => handleAddLayer(ILayer.id)}
                      className="text-green-600 text-xs border border-green-200 px-2 py-1 rounded-md hover:bg-green-50"
                    >
                      添加
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 模型结构 */}
            <div className="flex-[2] border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-semibold mb-3 text-gray-700">模型结构</h3>
              {currentLayers.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-md py-16 text-center text-gray-400">
                  点击左侧层添加到模型
                </div>
              ) : (
                <div className="space-y-3">
                  {currentLayers.map((ILayer, i) => (
                    <div
                      key={ILayer.id}
                      className="border border-gray-200 rounded-md p-3 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-200 text-gray-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {i + 1}
                          </span>
                          <h4 className="font-medium text-gray-700">{ILayer.type}</h4>
                        </div>
                        <button
                          onClick={() => handleRemoveLayer(ILayer.id)}
                          className="text-red-500 hover:text-red-700 text-lg"
                        >
                          ×
                        </button>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-md p-2 text-sm">
                        {Object.entries(ILayer.parameters).map(([k, v]) => (
                          <div key={k} className="flex justify-between text-gray-600">
                            <span className="font-medium">{k}:</span>
                            <span>{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 底部操作 */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => handleCloseForm()}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              取消
            </button>

            {mode === FormMode.Add && (<button
              onClick={handleCreateModel}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              创建模型
            </button>)}
            {mode === FormMode.Edit && (<button
              onClick={handleEditModel}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              保存修改
            </button>)}
          </div>
        </div>
      )}
    </div>
  )
}
