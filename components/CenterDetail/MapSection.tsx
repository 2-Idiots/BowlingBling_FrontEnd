import { CenterType } from '@/interface'
import DetailCenterMap from '../Map/DetailCenterMap'

export default function MapSection({ data }: { data: CenterType }) {
  return (
    <div className="py-8 px-4 border-t border-gray-300 leading-8 text-gray-800">
      <h2 className="font-semibold text-xl mb-2">볼링장 위치</h2>
      <div className="font-semibold">{data?.location}</div>
      <div className="mt-4">
        <DetailCenterMap data={data} />
      </div>
    </div>
  )
}
