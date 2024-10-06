'use client'

import { useState } from 'react'
import Map from '@/components/Map'
import { LessonType } from '@/interface'
import SelectedLesson from '@/components/Map/SelectedLesson'

export default function MapPage() {
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null)

  return (
    <>
      <Map setSelectedLesson={setSelectedLesson} />
      <SelectedLesson
        selectedLesson={selectedLesson}
        setSelectedLesson={setSelectedLesson}
      />
    </>
  )
}
