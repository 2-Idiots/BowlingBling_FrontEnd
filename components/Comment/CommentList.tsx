'use client'

import { useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { fetchComments } from '@/lib/api'
import { CommentType, LessonType } from '@/interface'
import { BiChevronRight } from 'react-icons/bi'
import CommentListModal from './CommentListModal'
import { FullPageLoader } from '../Loader'
import CommentItem from './CommentItem' // CommentItem import 추가

export default function CommentList({ data }: { data: LessonType }) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

  if (!data || !data.id) {
    return null
  }

  const closeModal = () => setIsOpenModal(false)
  const openModal = () => setIsOpenModal(true)

  const { data: comments, isLoading } = useInfiniteQuery(
    ['lesson-comments', data.id],
    ({ pageParam = 0 }) => fetchComments(data.id, pageParam),
    {
      getNextPageParam: (lastPage) =>
        lastPage.number < lastPage.totalPages - 1
          ? lastPage.number + 1
          : undefined,
    },
  )

  if (isLoading) return <FullPageLoader />

  return (
    <div>
      <h2 className="font-semibold text-xl mb-6">
        댓글 {comments?.pages?.[0]?.totalElements || 0}개
      </h2>
      <div className="mt-8 grid md:grid-cols-2 gap-12">
        {comments?.pages?.[0]?.content
          .slice(0, 4)
          .map((comment: CommentType) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              lessonId={data.id}
            />
          ))}
      </div>

      {comments?.pages?.[0]?.totalElements > 0 && (
        <div className="mt-8 mb-20">
          <button
            type="button"
            onClick={openModal}
            className="border border-gray-700 font-semibold rounded-lg px-6 py-4 flex items-center gap-4 hover:bg-black/5"
          >
            댓글 {comments.pages[0].totalElements}개 모두 보기
            <BiChevronRight className="text-xl" />
          </button>
        </div>
      )}

      {isOpenModal && (
        <CommentListModal
          isOpen={isOpenModal}
          closeModal={closeModal}
          data={data}
        />
      )}
    </div>
  )
}
