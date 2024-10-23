'use client'
import React, { useEffect, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'
import { useSession } from 'next-auth/react'
import { LessonType } from '@/interface'
import { fetchUserLikedLessons } from '@/lib/api'
import useIntersectionObserver from '@/hooks/useintersectionObserver'
import { LessonItem } from '@/components/LessonList'

export default function UserLikedLessons() {
  const ref = useRef<HTMLDivElement | null>(null)
  const pageRef = useIntersectionObserver(ref, {})
  const isPageEnd = !!pageRef?.isIntersecting
  const { data: session } = useSession()

  const {
    data: likedLessons,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery(
    ['liked-lessons', session?.user?.email],
    fetchUserLikedLessons,
    {
      enabled: !!session?.accessToken,
      getNextPageParam: (lastPage: any, pages) => {
        if (lastPage?.data?.length === 0) return undefined
        return pages.length + 1
      },
    },
  )

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined

    if (isPageEnd && hasNextPage) {
      timerId = setTimeout(() => {
        fetchNextPage()
      }, 500)
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId)
      }
    }
  }, [fetchNextPage, hasNextPage, isPageEnd])

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        찜한 레슨 목록을 불러오는데 실패했습니다.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-semibold text-lg md:text-2xl mb-4">찜한 레슨 목록</h1>
      <div className="mt-2 text-gray-500 mb-6">
        내가 찜한 레슨들을 모아볼 수 있습니다.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {likedLessons?.pages?.map((page: any, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page?.data?.map((lesson: LessonType) => (
              <LessonItem key={lesson.id} lesson={lesson} />
            ))}
          </React.Fragment>
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
        </div>
      )}

      <div className="w-full h-10 mb-10" ref={ref} />
    </div>
  )
}
