'use client'
import { IProject } from '@/types'
import Link from 'next/link'
import React, { useState } from 'react'
import { useProjectStore } from '@/store/useProjectStore'
import { useNotificationStore } from '@/components/Notification/Store/useNotificationStore'
import { Button } from 'antd'
export default function Page() {
  // 弹窗
  const { openNotificationWithIcon } = useNotificationStore()
  // 项目
  const { projects, setProjects } = useProjectStore()
  // 项目名称
  const [projectName, setProjectName] = useState<string>('')
  // 项目描述
  const [projectDescription, setProjectDescription] = useState<string>('')
  /**
   * 新增项目
   * @param e 事件对象
   */
  const handleAddProject = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    const newProject: IProject = {
      id: Date.now().toString(),
      name: projectName,
      description: projectDescription,
      createdAt: new Date().toLocaleString(),
      experiments: []
    }
    setProjects([...projects, newProject])
    setProjectName('')
    setProjectDescription('')
    openNotificationWithIcon('创建项目成功', '你已经成功创建项目', 'success')
  }
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* 页面标题 */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-semibold text-gray-800">项目管理</h1>
      </div>

      {/* 新增项目区域 */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <h3 className="text-xl font-medium text-gray-700">新增项目</h3>
        <form className="flex flex-col sm:flex-row gap-4 items-start">
          <input
            type="text"
            placeholder="项目名称"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="h-8 w-full sm:w-1/3 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="项目描述"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="h-8 w-full sm:w-1/2 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <Button
            onClick={(e) => handleAddProject(e)}
            type='primary'
          >
            添加项目
          </Button>
        </form>
      </div>

      {/* 项目列表区域 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-medium text-gray-700 mb-4">现有项目</h3>
        {projects.length ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((item) => (
              <li
                key={item.id}
                className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-gray-800">{item.name}</span>

                  <Link
                    href={`/project/edit/${item.id}`}
                  >
                    <Button
                      type='primary'
                    >
                      配置
                    </Button>
                  </Link>
                </div>
                <p className="text-gray-600 mb-2">{item.description || '暂无描述'}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>创建日期：{item.createdAt}</p>
                  <p>实验数量：{item.experiments.length}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-10">暂无项目，请先添加项目。</p>
        )}
      </div>
    </div >

  )
}
