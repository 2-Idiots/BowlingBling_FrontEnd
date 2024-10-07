import FeatureSection from '@/components/LessonDetail/FeatureSection'
import HeaderSection from '@/components/LessonDetail/HeaderSection'
import MapSection from '@/components/LessonDetail/MapSection'
import { LessonType, ParamsProps } from '@/interface'
import { fetchLessonById } from '@/lib/api'

export default async function LessonPage({ params }: ParamsProps) {
  const { id } = params
  const data: LessonType = await fetchLessonById(id)

  return (
    <div className="mt-8 mb-20 max-w-6xl mx-auto">
      <HeaderSection data={data} />
      <FeatureSection data={data} />
      <MapSection data={data} />
    </div>
  )
}
