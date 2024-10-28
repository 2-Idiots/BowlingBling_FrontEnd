import { LessonType } from '@/interface'
import Image from 'next/image'
import BookingSection from './BookingSection'
import { TbBallBowling } from 'react-icons/tb'
import { FeatureDesc } from '@/constants'
import CalendarSection from './CalendarSection'

export default function FeatureSection({ data }: { data: LessonType }) {
  return (
    <div className="md:grid md:grid-cols-3 gap-8 mt-8 relative">
      <div className="col-span-2">
        <div className="flex items-center justify-between px-4">
          <div>
            <h1 className="text-lg md:text-xl">
              {data?.teacherName ?? '사용자'}{' '}
              <span className="text-gray-800 text-sm">{data?.category}</span>
            </h1>
            {/* <p className="text-sm text-gray-600 mt-1"> */}
            <p className="text-md text-gray-600 mt-1">
              {data?.contents ?? '설명이 없습니다.'}
            </p>
          </div>
          <Image
            src={data?.user?.image || '/images/bowling-profile.png'}
            alt="user log"
            width={50}
            height={50}
            className="rounded-full shadow"
          />
        </div>

        <div className="mt-8 py-1 px-4">
          <h2 className="text-lg md:text-md mt-2">자격사항</h2>
          <div className="flex flex-col space-y-2">
            {data?.qualifications?.split('\n').map((qual, index) => (
              <div key={index} className="flex items-start">
                <span className="mr-3 text-gray-400">•</span>
                <span className="text-sm">{qual.trim()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 py-1 px-4">
          <h2 className="text-lg md:text-md">소개</h2>
          <div className="flex flex-col md:mt-2 text-md text-gray-500">
            {data?.contents ?? '소개가 없습니다.'}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-6 py-6 border-y border-gray-300">
          <h2 className="py-1 px-4 text-lg md:text-md">구질</h2>
          <div className="flex gap-6 items-center px-4">
            <TbBallBowling className="text-lg md:text-2xl" />
            <div className="font-semibold">스트로커</div>
            <div className="text-sm text-gray-400">
              {data?.program
                ? FeatureDesc[data.program as keyof typeof FeatureDesc]
                : '프로그램 정보가 없습니다.'}
            </div>
          </div>
        </div>
        <div className="py-8 px-4 border-b border-gray-300 leading-8 text-gray-800">
          <h1 className="font-semibold text-xl mb-2">캘린더</h1>
          <CalendarSection data={data} />
        </div>
      </div>
      <BookingSection data={data} />
    </div>
  )
}
