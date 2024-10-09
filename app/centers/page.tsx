'use client'

import React, { useEffect, useRef } from 'react'
import { GridLayout, CenterItem } from '@/components/CenterList'
import { Loader, LoaderGrid } from '@/components/Loader'
import { CenterType } from '@/interface'
import { useInfiniteQuery } from 'react-query'
import useIntersectionObserver from '@/hooks/useintersectionObserver'
import { fetchCenters } from '@/lib/api'
import { MapButton } from '@/components/Map'
import { useRouter } from 'next/navigation'

export default function CentersPage() {
  const router = useRouter()
  const ref = useRef<HTMLDivElement | null>(null)
  const pageRef = useIntersectionObserver(ref, {})
  const isPageEnd = !!pageRef?.isIntersecting

  const {
    data: centers,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery(
    'centers',
    ({ pageParam = 1 }) => fetchCenters(pageParam),
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
    return <div>Error loading centers</div>
  }

  if (isLoading) {
    return <LoaderGrid />
  }

  return (
    <>
      <GridLayout>
        {centers?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.content.map((center: CenterType) => (
              <CenterItem center={center} key={center.id} />
            ))}
          </React.Fragment>
        ))}
      </GridLayout>
      <MapButton onClick={() => router.push('/centers/map')} />
      {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
      <div className="w-full touch-none h-10 mb-10" ref={ref} />
    </>
  )
}
