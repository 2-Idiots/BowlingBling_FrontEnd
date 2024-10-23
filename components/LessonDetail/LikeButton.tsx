import React, { useState, useEffect } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { toast } from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { likeLesson, unlikeLesson, fetchUserLikedLessons } from '@/lib/api'
import { LessonType, LikedLessonsResponse } from '@/interface'

export default function LikeButton({ lesson }: { lesson: LessonType }) {
  const { data: session, status } = useSession()
  const queryClient = useQueryClient()
  const [isLiked, setIsLiked] = useState(false)

  const { data: likedLessonsResponse } = useQuery<LikedLessonsResponse>(
    'userLikedLessons',
    fetchUserLikedLessons,
    {
      enabled: !!session && status === 'authenticated',
      staleTime: 60000, // 1분동안 캐시 유지
    },
  )

  useEffect(() => {
    if (likedLessonsResponse?.data) {
      setIsLiked(
        likedLessonsResponse.data.some(
          (likedLesson) => likedLesson.id === lesson.id,
        ),
      )
    }
  }, [likedLessonsResponse, lesson.id])

  const likeMutation = useMutation(likeLesson, {
    onSuccess: () => {
      queryClient.invalidateQueries('userLikedLessons')
      setIsLiked(true)
      toast.success('찜 목록에 추가했습니다.')
    },
    onError: (error) => {
      console.error('Like error:', error)
      toast.error('찜하기에 실패했습니다.')
    },
  })

  const unlikeMutation = useMutation(unlikeLesson, {
    onSuccess: () => {
      queryClient.invalidateQueries('userLikedLessons')
      setIsLiked(false)
      toast.success('찜을 취소했습니다.')
    },
    onError: (error) => {
      console.error('Unlike error:', error)
      toast.error('찜 취소에 실패했습니다.')
    },
  })

  const toggleLike = () => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      toast.error('로그인 후 시도해주세요')
      return
    }
    if (lesson.id === undefined) {
      console.error('Lesson id is undefined')
      toast.error('레슨 정보를 불러오는데 실패했습니다.')
      return
    }

    if (isLiked) {
      unlikeMutation.mutate(lesson.id)
    } else {
      likeMutation.mutate(lesson.id)
    }
  }

  return (
    <button
      onClick={toggleLike}
      type="button"
      className="flex gap-2 items-center px-2 py-1.5 rounded-lg hover:bg-black/10"
      disabled={status === 'loading'}
    >
      {isLiked ? (
        <>
          <AiFillHeart className="text-red-500 hover:text-red-600 focus:text-red-600" />
          <span className="underline">취소</span>
        </>
      ) : (
        <>
          <AiOutlineHeart className="hover:text-red-600 focus:text-red-600" />
          <span className="underline">저장</span>
        </>
      )}
    </button>
  )
}
