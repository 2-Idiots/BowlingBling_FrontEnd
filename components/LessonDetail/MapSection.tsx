import { LessonType } from '@/interface'
import DetailLessonMap from '../Map/DetailLessonMap'

export default function MapSection({ data }: { data: LessonType }) {
  return (
    <div className="py-8 px-4 border-b border-gray-300 leading-8 text-gray-800">
      <h1 className="font-semibold text-xl mb-2">지도</h1>
      <div className="mt-4">
        <DetailLessonMap data={data} />
      </div>
      <div className="mt-8 font-semibold">{data?.location}</div>
    </div>
  )
}
