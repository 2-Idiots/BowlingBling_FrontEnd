'use client'
import { selectedGatheringState } from '@/atom'
import { BLUR_DATA_URL } from '@/constants'
import Link from 'next/link'
import Image from 'next/image'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useRecoilState } from 'recoil'

export default function SelectedGathering() {
  const [selectedGathering, setSelectedGathering] = useRecoilState(
    selectedGatheringState,
  )

  return (
    <div className="fixed inset-x-0 mx-auto bottom-20 rounded-lg shadow-lg max-w-xs md:max-w-sm z-10 w-full bg-white">
      {selectedGathering && (
        <div className="flex flex-col relative">
          <button
            type="button"
            onClick={() => setSelectedGathering(null)}
            className="absolute right-2 top-2 text-white text-2xl bg-black/20 rounded-full"
          >
            <AiOutlineCloseCircle />
          </button>
          <Link href={`/gatherings/${selectedGathering.id}`}>
            <div className="rounded-lg-t h-[200px] overflow-hidden">
              <Image
                src={selectedGathering?.images?.[0]}
                width={384}
                height={384}
                alt="gathering image"
                placeholder="blur"
                className="rounded-t-lg"
                blurDataURL={BLUR_DATA_URL}
              />
            </div>
            <div className="p-4 font-semibold bg-white rounded-b-lg">
              <div className="mt-2">{selectedGathering.title}</div>
              <div className="mt-1 text-gray-400">
                주최자: {selectedGathering.leadername}
              </div>
              <div className="mt-1">
                일시: {new Date(selectedGathering.date).toLocaleString()}
              </div>
              <div className="mt-1">
                참가자: {selectedGathering.currentParticipants}/
                {selectedGathering.maxParticipants}
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
