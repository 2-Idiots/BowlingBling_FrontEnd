import FeatureSection from '@/components/CenterDetail/FeatureSection'
import HeaderSection from '@/components/CenterDetail/HeaderSection'
import { CenterType, ParamsProps } from '@/interface'
import { fetchCenterById } from '@/lib/api'

export default async function CenterPage({ params }: ParamsProps) {
  const { id } = params
  const data: CenterType = await fetchCenterById(id)

  return (
    <div className="mt-8 mb-20 max-w-6xl mx-auto">
      <HeaderSection data={data} />
      <FeatureSection data={data} />
    </div>
  )
}
