import HeaderSection from '@/components/GatherDetail/HeaderSection'
import GatheringDetail from '@/components/GatherDetail/GatheringDetail'
import { GatheringType, ParamsProps } from '@/interface'
import { fetchGatheringById } from '@/lib/api'

export default async function GatheringPage({ params }: ParamsProps) {
  const { id } = params
  const data: GatheringType = await fetchGatheringById(id)

  return (
    <div className="mt-8 mb-20 max-w-6xl mx-auto">
      <HeaderSection data={data} />
      <GatheringDetail data={data} />
    </div>
  )
}
