import { LessonType } from '@/interface'
import { ReactNode } from 'react'
import Link from 'next/link'

import Image from 'next/image'
import { BLUR_DATA_URL } from '@/constants'

export function LessonItem({ lesson }: { lesson: LessonType }) {
  return (
    <div key={lesson.id}>
      <Link href={`/lesson/${lesson.id}`}>
        <Image
          src={lesson.imageUrls[0]}
          alt={lesson.title}
          width={500}
          height={500}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          // className="rounded-md w-full h-auto object-fit"
          className="rounded-md w-full h-64 object-cover"
        />
        <div className="mt-2 font-semibold text-sm flex items-center">
          <span className="mr-2">{lesson.teacherName}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-black text-white">
            {lesson.category}
          </span>
        </div>

        <div className="mt-1 text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
          {lesson.contents}
        </div>

        <div className="mt-1 text-gray-800 text-sm font-semibold">
          센터위치 {lesson.location}
        </div>
      </Link>
    </div>
  )
}

export function GridLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-20 sm:px-4 md:px-8 lg:px-16">
      {children}
    </div>
  )
}
