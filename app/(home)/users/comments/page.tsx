'use client'

import React from 'react'
import { useRef, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BiChevronRight } from 'react-icons/bi'
import { CommentType } from '@/interface'
import { fetchUserComments } from '@/lib/api'
import { Loader } from '@/components/Loader'
import Image from 'next/image'

// 댓글 타입별 설정
const COMMENT_TYPE_CONFIG = {
  LESSON: {
    path: '/lesson',
    text: '레슨 보기',
  },
  CENTER: {
    path: '/centers',
    text: '볼링장 보기',
  },
  GATHERING: {
    path: '/gatherings',
    text: '번개 보기',
  },
} as const

export default function UserComments() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const {
    data: comments,
    isLoading,
    isError,
  } = useQuery(
    [`user-comments-${session?.user?.email}`],
    () => fetchUserComments({}),
    {
      enabled: status === 'authenticated',
    },
  )

  // 댓글 타입에 따른 설정 가져오기
  const getCommentConfig = (commentType: string) => {
    return (
      COMMENT_TYPE_CONFIG[commentType as keyof typeof COMMENT_TYPE_CONFIG] ||
      COMMENT_TYPE_CONFIG.LESSON
    )
  }

  // 컨텐츠 보기 버튼 클릭 핸들러
  const handleContentView = (comment: CommentType) => {
    const config = getCommentConfig(comment.commentType)
    router.push(`${config.path}/${comment.commentId}`)
  }

  if (status === 'unauthenticated') {
    router.push('/users/login')
    return null
  }

  if (isLoading) return <Loader />

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        댓글 목록을 불러오는데 실패했습니다.
      </div>
    )
  }

  const hasComments = comments?.data?.length > 0

  if (!hasComments) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-semibold text-lg md:text-2xl mb-4">내가 쓴 댓글</h1>
        <div className="mt-2 text-gray-500 mb-6">
          아직 작성한 댓글이 없습니다.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-semibold text-lg md:text-2xl mb-4">내가 쓴 댓글</h1>
      <div className="mt-2 text-gray-500 mb-6">
        내가 작성한 모든 댓글을 확인할 수 있습니다.
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-12">
        {comments?.data?.map((comment: CommentType) => {
          const config = getCommentConfig(comment.commentType)

          return (
            <div key={comment.id} className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <Image
                  src={comment.image || '/images/bowling-profile.png'}
                  alt="profile img"
                  width={50}
                  height={50}
                  className="rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/bowling-profile.png'
                  }}
                />
                <div>
                  <h3 className="font-semibold">{comment.memberName}</h3>
                  <div className="text-gray-500 text-xs">
                    {new Date(comment.modifiedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-gray-600 break-words">
                {comment.comments}
              </div>
              <button
                type="button"
                onClick={() => handleContentView(comment)}
                className="flex items-center gap-1 text-rose-600 hover:text-rose-500 font-semibold"
              >
                {config.text}
                <BiChevronRight className="text-xl" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
