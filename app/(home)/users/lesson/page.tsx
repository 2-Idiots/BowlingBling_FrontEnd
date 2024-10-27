'use client'
import React, { useEffect, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'
import { useSession } from 'next-auth/react'
import { fetchMyLessonBookings } from '@/lib/api'
import useIntersectionObserver from '@/hooks/useintersectionObserver'
import { BookedLessonItem } from '@/components/BookedLesson'

export default function UserLessonBookings() {
  const ref = useRef(null)
  const pageRef = useIntersectionObserver(ref, {})
  const isPageEnd = !!pageRef?.isIntersecting
  const { data: session } = useSession()

  const {
    data: lessonBookings,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery(
    ['lesson-bookings', session?.user?.email],
    fetchMyLessonBookings,
    {
      enabled: !!session?.accessToken,
      getNextPageParam: (lastPage, pages) => {
        if (!lastPage?.data || lastPage.data.length < 8) {
          return undefined
        }
        return lastPage.page + 1
      },
      select: (data) => {
        return {
          pages: data.pages,
          pageParams: data.pageParams,
        }
      },
    },
  )

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined

    if (isPageEnd && hasNextPage && !isFetching) {
      timerId = setTimeout(() => {
        fetchNextPage()
      }, 500)
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId)
      }
    }
  }, [fetchNextPage, hasNextPage, isPageEnd, isFetching])

  if (isError) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          예약한 레슨 목록을 불러오는데 실패했습니다.
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="text-center">로딩중...</div>
      </div>
    )
  }

  // 중복 제거를 위한 Set 사용
  const seenIds = new Set()
  const filteredBookings = lessonBookings?.pages.flatMap((page) =>
    page.data.filter((booking: any) => {
      if (seenIds.has(booking.id)) {
        return false
      }
      seenIds.add(booking.id)
      return true
    }),
  )

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">예약한 레슨 목록</h1>

      <p className="text-gray-600 mb-8">
        내가 예약한 레슨들을 모아볼 수 있습니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings?.map((booking: any) => (
          <BookedLessonItem key={booking.id} lesson={booking} />
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="text-center py-4">
          <div>로딩중...</div>
        </div>
      )}

      <div ref={ref} style={{ height: '10px' }} />
    </div>
  )
}
