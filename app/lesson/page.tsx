'use client'
import React, { useEffect, useRef } from 'react'
import { GridLayout, LessonItem } from '@/components/LessonList'
import { Loader, LoaderGrid } from '@/components/Loader'
import { LessonType } from '@/interface'
import { useInfiniteQuery } from 'react-query'
import useIntersectionObserver from '@/hooks/useintersectionObserver'
import { fetchLessons } from '@/lib/api'

export default function LessonsPage() {
  const ref = useRef<HTMLDivElement | null>(null)
  const pageRef = useIntersectionObserver(ref, {})
  const isPageEnd = !!pageRef?.isIntersecting

  const {
    data: lessons,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery(
    'lessons',
    ({ pageParam = 1 }) => fetchLessons(pageParam),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.content.length > 0 ? pages.length + 1 : undefined,
    },
  )

  useEffect(() => {
    if (isPageEnd && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isPageEnd])

  if (isError) {
    return <div>Error loading lessons</div>
  }

  return (
    <>
      <GridLayout>
        {isLoading ? (
          <LoaderGrid />
        ) : (
          lessons?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.content.map((lesson: LessonType) => (
                <LessonItem lesson={lesson} key={lesson.id} />
              ))}
            </React.Fragment>
          ))
        )}
      </GridLayout>
      {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
      <div className="w-full touch-none h-10 mb-10" ref={ref} />
    </>
  )
}
