'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { TbBallBowling } from 'react-icons/tb'
import {
  AiOutlineMenu,
  AiOutlineUser,
  AiOutlineSearch,
  AiOutlineClose,
} from 'react-icons/ai'
import cn from 'classnames'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

const links = [
  { url: '/lesson', title: '레슨' },
  { url: '/centers', title: '볼링장' },
  { url: '/clubs', title: '동호회' },
]

const LOGIN_USER_MENU = [
  { id: 1, title: '로그인', url: '/users/signin' },
  { id: 2, title: '회원가입', url: '/users/signup' },
  { id: 3, title: 'FAQ', url: '/faqs' },
]

const LOGOUT_USER_MENU = [
  { id: 1, title: '프로필', url: '/users/mypage' },
  { id: 2, title: 'FAQ', url: '/faqs' },
  { id: 3, title: '로그아웃', url: '#', signOut: true },
]

const filterCategories = {
  레슨: ['프로', '센터', '구질', '지역별'],
  볼링장: [
    '전국',
    '서울',
    '경기',
    '인천',
    '강원',
    '충청도',
    '경상도',
    '전라도',
    '제주',
  ],
  동호회: [
    '전국',
    '서울',
    '경기',
    '인천',
    '강원',
    '충청도',
    '경상도',
    '전라도',
    '제주',
  ],
}

type FilterCategoryType = keyof typeof filterCategories | ''
type DetailFilterType = string

interface FilterProps {
  [key: string]: string
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<FilterCategoryType>('')
  const [showMenu, setShowMenu] = useState(false)
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [detailFilter, setDetailFilter] = useState<null | DetailFilterType>(
    null,
  )
  const [filterValue, setFilterValue] = useState<FilterProps>({})
  const [lastClickedTab, setLastClickedTab] = useState<FilterCategoryType>('')

  useEffect(() => {
    const currentLink = links.find((link) => pathname.startsWith(link.url))
    if (currentLink) {
      setActiveTab(currentLink.title as FilterCategoryType)
      setLastClickedTab('') // Reset lastClickedTab when pathname changes
    } else {
      setActiveTab('')
      setLastClickedTab('')
    }
    setShowFilter(false) // Close filter when pathname changes
  }, [pathname])

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleTabClick = (title: FilterCategoryType) => {
    if (activeTab === title && lastClickedTab === title) {
      // If clicking the same tab twice, toggle the filter
      setShowFilter(!showFilter)
    } else {
      // If clicking a different tab or the same tab for the first time, just set it active
      setShowFilter(false)
    }
    setActiveTab(title)
    setLastClickedTab(title)
    setDetailFilter(null)
  }

  const handleCloseFilter = () => {
    setShowFilter(false)
    setDetailFilter(null)
  }

  const handleMenuClick = (menu: { url: string; signOut?: boolean }) => {
    if (menu.signOut) {
      signOut({ callbackUrl: '/' })
    } else {
      router.push(menu.url)
    }
    setShowMenu(false)
  }

  return (
    <nav className="bg-white shadow-md p-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-rose-500 cursor-pointer"
        >
          <TbBallBowling className="text-4xl" />
          <span className="text-xl font-semibold">Bowling Bling</span>
        </Link>

        <div className="flex-1 max-w-xl mx-4">
          <div className="flex justify-center gap-2">
            {links.map((link) => (
              <button
                key={link.url}
                onClick={() => {
                  handleNavigation(link.url)
                  handleTabClick(link.title as FilterCategoryType)
                }}
                className={cn(
                  'py-2 px-4 rounded-full text-sm font-semibold transition-colors',
                  activeTab === link.title
                    ? 'bg-rose-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100',
                )}
              >
                {link.title}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="font-semibold text-sm px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => activeTab && setShowFilter(true)}
          >
            원하는 {activeTab || '항목'} 검색해보세요
          </button>
          <div className="z-[20] relative">
            <button
              type="button"
              onClick={() => setShowMenu((val) => !val)}
              className="flex items-center gap-2 rounded-full border border-gray-200 shadow-sm px-4 py-2 hover:shadow-md transition-shadow"
            >
              <AiOutlineMenu />
              {status === 'authenticated' && session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="rounded-full w-4 h-4 my-auto"
                />
              ) : (
                <AiOutlineUser />
              )}
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {(status === 'authenticated'
                    ? LOGOUT_USER_MENU
                    : LOGIN_USER_MENU
                  ).map((menu) => (
                    <button
                      key={menu.id}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => handleMenuClick(menu)}
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
      {showFilter && activeTab && (
        <div className="container mx-auto mt-4 p-4 bg-white shadow-md rounded-lg relative">
          <button
            onClick={handleCloseFilter}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <AiOutlineClose className="text-xl" />
          </button>
          <div className="flex space-x-4 mb-4">
            {filterCategories[activeTab].map((filter) => (
              <button
                key={filter}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-semibold',
                  detailFilter === filter.toLowerCase()
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                )}
                onClick={() => setDetailFilter(filter.toLowerCase())}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex items-center">
            <input
              type="text"
              placeholder={`${activeTab}검색해보세요`}
              className="flex-grow py-2 px-4 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="button"
              className="bg-rose-500 text-white rounded-r-full p-2 px-4"
            >
              <AiOutlineSearch className="text-lg" />
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
