'use client'

import CommentForm from './CommentForm'
import CommentList from './CommentList'
import { LessonType } from '@/interface'

export default function Comment({ data }: { data: LessonType }) {
  if (!data || !data.id) {
    return null
  }

  return (
    <div className="border-b border-gray-300 py-8 px-4">
      <CommentList data={data} />
      <CommentForm data={data} />
    </div>
  )
}
