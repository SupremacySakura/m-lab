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
    <div className="min-h-screen bg-background p-6 md:p-8 space-y-8">
      {/* 顶部：创建项目区域 */}
      <div className="max-w-7xl mx-auto bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">项目管理</h1>
              <p className="text-gray-400 mt-1">创建并管理您的机器学习项目与实验配置</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0f1623] border border-border/50 rounded-lg p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            快速创建新项目
          </h3>
          <form className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="flex-1">
              <input
                type="text"
                placeholder="项目名称"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full h-11 bg-card border border-border rounded-md px-4 text-gray-200 placeholder:text-gray-600 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="flex-[2]">
              <input
                type="text"
                placeholder="项目描述（可选）"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full h-11 bg-card border border-border rounded-md px-4 text-gray-200 placeholder:text-gray-600 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              />
            </div>
            <Button
              onClick={(e) => handleAddProject(e)}
              type='primary'
              className="h-11 px-8 !bg-primary hover:!bg-blue-600 border-none font-medium shadow-lg shadow-blue-500/20"
            >
              创建项目
            </Button>
          </form>
        </div>
      </div>

      {/* 项目列表区域 */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
            </svg>
            现有项目
            <span className="ml-3 text-sm font-normal text-gray-500 bg-border/50 px-2 py-0.5 rounded-full">{projects.length}</span>
          </h2>
        </div>

        {projects.length ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((item) => (
              <li
                key={item.id}
                className="group bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0 6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M6 3v18m12-18v18" opacity="0.5" />
                      {/* Using a generic project icon instead */}
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                    </svg>
                  </div>
                  <Link href={`/project/edit/${item.id}`}>
                    <Button
                      type='text'
                      className="text-primary hover:bg-primary/10 hover:text-primary-focus p-2 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </Button>
                  </Link>
                </div>

                <h3 className="text-lg font-bold text-gray-200 mb-2 truncate">{item.name}</h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow h-[40px]">
                  {item.description || '暂无项目描述'}
                </p>

                <div className="pt-4 border-t border-border mt-auto grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0h18M5.25 12h13.5h-13.5Zm2.1 1.5.8.8 3.2-3.2" />
                    </svg>
                    <span>{item.createdAt.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                    <span>{item.experiments.length} 个实验</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-xl border-dashed">
            <div className="bg-[#0f1623] p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg font-medium">暂无项目</p>
            <p className="text-gray-600 text-sm mt-1">请在上方创建您的第一个项目</p>
          </div>
        )}
      </div>
    </div >

  )
}
