'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const pathname = usePathname()

  const linkClass = (path: string) =>
    `font-medium text-[1.05rem] px-4 py-2 rounded-lg transition-all duration-200
    ${
      pathname === path
        ? 'bg-[#5b8fd8] text-white shadow-sm'
        : 'text-[#5b8fd8] hover:bg-[#5b8fd8]/10 hover:text-[#3a6cb3]'
    }`

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md py-2 shadow-[0_2px_12px_rgba(0,0,0,0.05)] sticky top-0 z-50">
      <div className="flex justify-center gap-8">
        <Link href="/" className={linkClass('/')}>
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
      </div>
    </nav>
  )
}
