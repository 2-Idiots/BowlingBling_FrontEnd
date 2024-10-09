'use client'
import { GatheringType } from '@/interface'
import { useState } from 'react'
import MapSection from './MapSection'

export default function GatheringDetail({ data }: { data: GatheringType }) {
  const [currentParticipants, setCurrentParticipants] = useState(
    data.currentParticipants,
  )

  const handleJoin = async () => {
    // TODO: API 호출로 참가 로직 구현
    // const response = await joinGathering(data.id)
    // if (response.success) {
    setCurrentParticipants((prev) => prev + 1)
    // }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">주최자:</span> {data.leadername}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">설명:</span> {data.description}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">장소:</span> {data.location}
            </p>
          </div>
          <div>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">날짜:</span>{' '}
              {new Date(data.date).toLocaleString()}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">평균 점수 범위:</span>{' '}
              {data.minAverage} - {data.maxAverage}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">참가자:</span>{' '}
              {currentParticipants} / {data.maxParticipants}
            </p>
          </div>
        </div>
        <button
          onClick={handleJoin}
          disabled={currentParticipants >= data.maxParticipants}
          className="mt-6 bg-rose-500 text-white px-6 py-3 rounded-md hover:bg-rose-600 transition-colors disabled:bg-gray-400 w-full md:w-auto"
        >
          참가하기
        </button>
      </div>
      <MapSection data={data} />
    </div>
  )
}
