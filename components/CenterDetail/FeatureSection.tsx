'use client'
import { CenterType } from '@/interface'
import { GiBowlingAlley } from 'react-icons/gi'
import { IoTimeSharp } from 'react-icons/io5'
import MapSection from './MapSection'

export default function FeatureSection({ data }: { data: CenterType }) {
  return (
    <div className="md:grid md:grid-cols-3 gap-8 mt-8 relative">
      <div className="col-span-2">
        <div className="flex items-center justify-between px-4">
          <div>
            <h1 className="text-lg md:text-xl font-semibold">
              {data?.businessName}
            </h1>
            <p className="text-md text-gray-600 mt-1">{data?.location}</p>
          </div>
        </div>

        <div className="mt-8 py-1 px-4">
          <h2 className="text-lg md:text-md font-semibold">소개</h2>
          <div className="flex items-center md:mt-2 text-md">
            {data?.announcements}
          </div>
        </div>

        <div className="mt-8 py-1 px-4">
          <h2 className="text-lg md:text-md font-semibold">운영 시간</h2>
          <div className="flex items-center md:mt-2 text-md">
            <IoTimeSharp className="text-lg md:text-2xl mr-5" />{' '}
            {data?.operatingHours}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-6 py-6 border-y border-gray-300">
          <h2 className="py-1 px-4 text-lg md:text-md font-semibold">
            레인 정보
          </h2>
          <div className="flex gap-6 items-center px-4">
            <GiBowlingAlley className="text-lg md:text-2xl" />
            <div className="font-medium">총 레인 수: {data.laneCount}</div>
          </div>
        </div>
        <MapSection data={data} />
      </div>
    </div>
  )
}
