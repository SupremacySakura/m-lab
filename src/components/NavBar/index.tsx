'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
    const pathname = usePathname()

    const linkClass = (path: string) =>
        `font-semibold text-[1.15rem] px-6 py-2 rounded-xl transition-all duration-300 
    ${pathname === path ? 'bg-[#4a6fa5] text-white shadow-md' : 'text-[#4a6fa5] hover:bg-[#4a6fa5] hover:text-white hover:-translate-y-0.5'}`

    return (
        <nav className="w-screen bg-white py-4 shadow-[0_4px_32px_0_rgba(0,0,0,0.1)] sticky top-0 z-50">
            <div className="flex justify-center gap-12">
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
