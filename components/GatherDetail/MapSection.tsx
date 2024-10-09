import { GatheringType } from '@/interface'
import DetailGatheringMap from '../Map/DetailGatheringMap'

export default function MapSection({ data }: { data: GatheringType }) {
  return (
    <div className="py-8 px-4 border-t border-gray-300 leading-8 text-gray-800">
      <h2 className="font-semibold text-xl mb-2">모임 장소</h2>
      <div className="font-semibold">{data?.location}</div>
      <div className="mt-4">
        <DetailGatheringMap data={data} />
      </div>
    </div>
  )
}
