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
    console.log(user)
  }
  const linkClass = (path: string) =>
    `font-medium text-[1.05rem] px-4 py-2 rounded-lg transition-all duration-200
    ${pathname === path
      ? 'bg-[#5b8fd8] text-white shadow-sm'
      : 'text-[#5b8fd8] hover:bg-[#5b8fd8]/10 hover:text-[#3a6cb3]'
    }`

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md py-2 shadow-[0_2px_12px_rgba(0,0,0,0.05)] sticky top-0 z-50">
      <div className="flex justify-center gap-8 items-center">
        <Link href="/" className={`${linkClass('/')} ml-auto`}>
          主页
        </Link>
        <Link href="/dish" className={linkClass('/dish')}>
          食堂菜品识别页
        </Link>
        <Link href="/project" className={linkClass('/project')}>
          项目
        </Link>
        <Link href="/model" className={linkClass('/model')}>
          模型管理
        </Link>

        {!user.id && <Button className={`ml-auto mr-2`}><Link href="/login" >登录</Link></Button>}
        {user.id && <div className='ml-auto flex items-center gap-2 mr-2'>
          <img src={user?.avatar} alt="" className='w-10 h-10 rounded-full' />
          <span>{user.username}</span>
          <Button onClick={handleLogout}>登出</Button>
        </div>}
      </div>
    </nav>
  )
}
