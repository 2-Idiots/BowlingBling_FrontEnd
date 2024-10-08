'use client'

import { useState, useEffect } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import Image from 'next/image'

interface CenterType {
  id: number
  name: string
  location: string
  operatingHours: string
  imageUrl: string
}

const regions = [
  '전국',
  '서울',
  '경기',
  '인천',
  '대전',
  '충청',
  '경북',
  '경남',
  '전라북도',
  '전라남도',
  '부산',
]

// Mock Data: Replace this with actual data from your backend later
const mockCenters: CenterType[] = [
  {
    id: 1,
    name: '동서울그랜드볼링센터',
    location: '서울 중랑구 망우로 50',
    operatingHours: '10:00 - 03:00',
    imageUrl: '/images/bowling-profile.png',
  },
  {
    id: 2,
    name: '골드볼링장',
    location: '경남 창원시 의창구 율로로',
    operatingHours: '09:00 - 02:00',
    imageUrl: '/images/bowling-profile.png',
  },
  {
    id: 3,
    name: '엑스존 볼링클럽',
    location: '경기 용인시 기흥구 중부대로 242',
    operatingHours: '10:00 - 03:00',
    imageUrl: '/images/bowling-profile.png',
  },
  // Add more centers as needed
]

export default function CentersPage() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('전국')
  const [filteredCenters, setFilteredCenters] =
    useState<CenterType[]>(mockCenters)

  useEffect(() => {
    const filtered = mockCenters.filter(
      (center) =>
        (region === '전국' || center.location.includes(region)) &&
        center.name.includes(search),
    )
    setFilteredCenters(filtered)
  }, [search, region])

  return (
    <div className="container mx-auto mt-20 p-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-6">
        <input
          type="text"
          placeholder="볼링장 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <AiOutlineSearch className="text-2xl text-rose-500" />
      </div>

      {/* Region Filter */}
      <div className="flex space-x-4 mb-6 overflow-x-auto">
        {regions.map((reg) => (
          <button
            key={reg}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              region === reg
                ? 'bg-rose-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setRegion(reg)}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* Center List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCenters.map((center) => (
          <div key={center.id} className="bg-white shadow-md rounded-lg p-4">
            <Image
              src={center.imageUrl}
              alt={center.name}
              width={300}
              height={200}
              className="rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900">
              {center.name}
            </h3>
            <p className="text-sm text-gray-600">{center.location}</p>
            <p className="text-sm text-gray-500">
              운영 시간: {center.operatingHours}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
