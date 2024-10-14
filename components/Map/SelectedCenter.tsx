'use client'
import { selectedCenterState } from '@/atom'
import { BLUR_DATA_URL } from '@/constants'
import Link from 'next/link'
import Image from 'next/image'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useRecoilState } from 'recoil'

export default function SelectedCenter() {
  const [selectedCenter, setSelectedCenter] =
    useRecoilState(selectedCenterState)

  return (
    <div className="fixed inset-x-0 mx-auto bottom-20 rounded-lg shadow-lg max-w-xs md:max-w-sm z-10 w-full bg-white">
      {selectedCenter && (
        <div className="flex flex-col relative">
          <button
            type="button"
            onClick={() => setSelectedCenter(null)}
            className="absolute right-2 top-2 text-white text-2xl bg-black/20 rounded-full"
          >
            <AiOutlineCloseCircle />
          </button>
          <Link href={`/centers/${selectedCenter.id}`}>
            <div className="rounded-lg-t h-[200px] overflow-hidden">
              <Image
                src={selectedCenter?.images?.[0]}
                width={384}
                height={384}
                alt="center image"
                placeholder="blur"
                className="rounded-t-lg"
                blurDataURL={BLUR_DATA_URL}
              />
            </div>
            <div className="p-4 font-semibold bg-white rounded-b-lg">
              <div className="mt-2">{selectedCenter.businessName}</div>
              <div className="mt-1 text-gray-400">
                {selectedCenter.location}
              </div>
              <div className="mt-1">레인 수: {selectedCenter.laneCount}</div>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
