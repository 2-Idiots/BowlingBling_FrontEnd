import { GatheringType } from '@/interface'
import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BLUR_DATA_URL } from '@/constants'

export function GatheringItem({ gathering }: { gathering: GatheringType }) {
  return (
    <div key={gathering.id}>
      <Link href={`/gatherings/${gathering.id}`}>
        <Image
          src={gathering.images[0]}
          alt={gathering.title}
          width={500}
          height={500}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="rounded-md w-full h-64 object-cover"
        />
        <div className="mt-2 font-semibold text-sm flex items-center">
          <span className="mr-2">{gathering.title}</span>
        </div>

        <div className="mt-1 text-gray-800 text-sm font-semibold">
          주최자: {gathering.leadername}
        </div>

        <div className="mt-1 text-sm text-gray-500">
          장소: {gathering.location}
        </div>

        <div className="mt-1 text-sm text-gray-500">
          날짜: {new Date(gathering.date).toLocaleString()}
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
