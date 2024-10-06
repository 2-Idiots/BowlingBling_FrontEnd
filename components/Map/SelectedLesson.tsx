'use client'
import { selectedLessonState } from '@/atom'
import { BLUR_DATA_URL } from '@/constants'
import Image from 'next/image'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useRecoilState } from 'recoil'

export default function SelectedLesson() {
  const [selectedLesson, setSelectedLesson] =
    useRecoilState(selectedLessonState)
  return (
    <div className="fixed inset-x-0 mx-auto bottom-20 rounded-lg shadow-lg max-w-xs md:max-w-sm z-10 w-full bg-white">
      {selectedLesson && (
        <div className="flex flex-col relative">
          <button
            type="button"
            onClick={() => setSelectedLesson(null)}
            className="absolute right-2 top-2 text-white text-2xl bg-black/20 rounded-full"
          >
            <AiOutlineCloseCircle />
          </button>
          <div className="rounded-lg-t h-[200px] overflow-hidden">
            <Image
              src={selectedLesson?.imageUrls?.[0]}
              width={384}
              height={384}
              alt="lesson image"
              placeholder="blur"
              className="rounded-t-lg"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>
          <div className="p-4 font-semibold bg-white rounded-b-lg">
            <div className="mt-2">
              {selectedLesson.teacherName} {selectedLesson.category}
            </div>
            <div className="mt-1 text-gray-400">
              센터위치 {selectedLesson.location}
            </div>
            <div className="mt-1">
              {selectedLesson.price?.toLocaleString()}원{' '}
              <span className="text-gray-400"> /1회</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
