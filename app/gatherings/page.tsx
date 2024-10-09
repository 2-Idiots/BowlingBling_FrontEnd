'use client'

import React, { useEffect, useRef } from 'react'
import { Loader, LoaderGrid } from '@/components/Loader'
import { GatheringType } from '@/interface'
import { useInfiniteQuery } from 'react-query'
import useIntersectionObserver from '@/hooks/useintersectionObserver'
import { fetchGatherings } from '@/lib/api'
import { MapButton } from '@/components/Map'
import { useRouter } from 'next/navigation'
import { GatheringItem, GridLayout } from '@/components/GatherList'

export default function GatheringsPage() {
  const router = useRouter()
  const ref = useRef<HTMLDivElement | null>(null)
  const pageRef = useIntersectionObserver(ref, {})
  const isPageEnd = !!pageRef?.isIntersecting

  const {
    data: gatherings,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery(
    'gatherings',
    ({ pageParam = 1 }) => fetchGatherings(pageParam),
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
    return <div>Error loading gatherings</div>
  }

  if (isLoading) {
    return <LoaderGrid />
  }

  return (
    <>
      <GridLayout>
        {gatherings?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.content.map((gathering: GatheringType) => (
              <GatheringItem gathering={gathering} key={gathering.id} />
            ))}
          </React.Fragment>
        ))}
      </GridLayout>
      <MapButton onClick={() => router.push('/gatherings/map')} />
      {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
      <div className="w-full touch-none h-10 mb-10" ref={ref} />
    </>
  )
}
