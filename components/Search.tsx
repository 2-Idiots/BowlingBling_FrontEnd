'use client'

import { useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

export default function Search() {
  const [activeTab, setActiveTab] = useState('프로')
  const tabs = ['프로', '센터', '구휘', '지하철역']

  return (
    <div className="bg-white rounded-3xl shadow-md p-4 max-w-3xl mx-auto">
      <div className="flex mb-4 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-rose-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder={`${activeTab} 검색`}
          className="w-full py-3 px-5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        />
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-colors">
          <AiOutlineSearch className="text-xl" />
        </button>
      </div>
    </div>
  )
}
