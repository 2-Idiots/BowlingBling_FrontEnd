'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { TbBallBowling } from 'react-icons/tb'
import { AiOutlineMenu, AiOutlineUser } from 'react-icons/ai'

const tabs = [
  { name: '레슨', path: '/lesson' },
  { name: '볼링장', path: '/centers' },
  { name: '동호회', path: '/clubs' },
]

const menus = [
  { id: 1, title: '로그인', url: '/users/login' },
  { id: 2, title: '회원가입', url: '/users/signup' },
  { id: 3, title: 'FAQ', url: '/faqs' },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState('')
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const currentTab = tabs.find((tab) => pathname.startsWith(tab.path))
    if (currentTab) {
      setActiveTab(currentTab.name)
    } else {
      setActiveTab('')
    }
  }, [pathname])

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <nav className="bg-white shadow-md p-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div
          className="flex items-center gap-2 text-rose-500 cursor-pointer"
          onClick={() => {
            handleNavigation('/')
            setActiveTab('')
          }}
        >
          <TbBallBowling className="text-4xl" />
          <span className="text-xl font-semibold">Bowling Bling</span>
        </div>

        <div className="flex-1 max-w-xl mx-4">
          <div className="flex justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => {
                  handleNavigation(tab.path)
                  setActiveTab(tab.name)
                }}
                className={`py-2 px-4 rounded-full text-sm font-semibold transition-colors ${
                  activeTab === tab.name
                    ? 'bg-rose-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="font-semibold text-sm px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            원하는 {activeTab || '항목'}을 검색해보세요
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((val) => !val)}
              className="flex items-center gap-2 rounded-full border border-gray-200 shadow-sm px-4 py-2 hover:shadow-md transition-shadow"
            >
              <AiOutlineMenu />
              <AiOutlineUser />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {menus?.map((menu) => (
                    <button
                      key={menu.id}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => {
                        handleNavigation(menu.url)
                        setShowMenu(false)
                      }}
                    >
                      {menu.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
