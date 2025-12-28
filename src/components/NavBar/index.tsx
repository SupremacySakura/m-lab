'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUserStore } from '@/store/useUserStore'
import { Button } from 'antd'

export default function NavBar() {
  const pathname = usePathname()
  const { user, logout } = useUserStore()

  const handleLogout = async () => {
    logout()
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const linkClass = (path: string) =>
    `relative px-1 py-2 text-[0.95rem] font-medium transition-colors duration-200
    ${isActive(path)
      ? 'text-primary'
      : 'text-gray-400 hover:text-gray-200'
    }`

  const activeIndicator = (
    <span className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-primary shadow-[0_0_12px_rgba(59,130,246,0.6)] rounded-t-full"></span>
  )

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-[#0B1121]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 group-hover:border-primary/30 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-100 group-hover:text-white transition-colors">M-Lab</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={linkClass('/')}>
            主页
            {isActive('/') && activeIndicator}
          </Link>
          <Link href="/dish" className={linkClass('/dish')}>
            菜品识别
            {isActive('/dish') && activeIndicator}
          </Link>
          <Link href="/project" className={linkClass('/project')}>
            项目管理
            {isActive('/project') && activeIndicator}
          </Link>
          <Link href="/model" className={linkClass('/model')}>
            模型中心
            {isActive('/model') && activeIndicator}
          </Link>
        </div>

        {/* User Action Area */}
        <div className="flex items-center gap-4">
          {!user.id ? (
            <Link href="/login">
              <Button type="primary" className="h-9 px-6 bg-primary hover:bg-blue-600 border-none shadow-lg shadow-blue-500/20 rounded-lg">
                登录
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-4 pl-6 border-l border-border/50">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-200 leading-none">{user.username}</p>
                  <p className="text-[10px] text-gray-500 mt-1 leading-none uppercase tracking-wider">Admin</p>
                </div>
                <div className="relative">
                  <img
                    src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                    alt="avatar"
                    className="h-9 w-9 rounded-full border border-border bg-gray-800 object-cover"
                  />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[#0B1121]"></span>
                </div>
              </div>

              <Button
                type="text"
                className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 h-9 w-9 flex items-center justify-center rounded-lg transition-all"
                onClick={handleLogout}
                title="退出登录"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
