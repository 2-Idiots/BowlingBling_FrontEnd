'use client'

import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useRef } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useInfiniteQuery } from 'react-query'
import { CommentType, LessonType } from '@/interface'
import { FullPageLoader } from '../Loader'
import { fetchComments } from '@/lib/api'
import useIntersectionObserver from '@/hooks/useintersectionObserver'
import CommentItem from './CommentItem'

export default function CommentListModal({
  isOpen,
  closeModal,
  data,
}: {
  isOpen: boolean
  closeModal: () => void
  data: LessonType
}) {
  if (!data || !data.id) {
    return null
  }

  const ref = useRef<HTMLDivElement | null>(null)
  const pageRef = useIntersectionObserver(ref, {
    rootMargin: '10%',
    enableObserver: !!ref.current,
  })
  const isPageEnd = !!pageRef?.isIntersecting

  const {
    data: comments,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery(
    [`lesson-${data.id}-comments-infinite`],
    ({ pageParam = 0 }) => fetchComments(data.id, pageParam),
    {
      getNextPageParam: (lastPage) =>
        lastPage.number < lastPage.totalPages - 1
          ? lastPage.number + 1
          : undefined,
    },
  )

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined
    if (isPageEnd && hasNextPage) {
      timerId = setTimeout(() => {
        fetchNextPage()
      }, 500)
    }

    return () => clearTimeout(timerId)
  }, [isPageEnd, hasNextPage, fetchNextPage])

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeModal()
                  }}
                  className="rounded-full p-2 hover:bg-black/5 mb-4"
                >
                  <AiOutlineClose />
                </button>
                <Dialog.Title
                  as="h3"
                  className="text-xl md:text-2xl font-medium leading-6 text-gray-900"
                >
                  댓글 전체 보기
                </Dialog.Title>
                <div
                  className="mt-8 flex flex-col gap-8 mx-auto max-w-lg mb-10"
                  onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
                >
                  {comments?.pages?.map((page, index) => (
                    <React.Fragment key={index}>
                      {page.content.map((comment: CommentType) => (
                        <div
                          key={comment.id}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CommentItem comment={comment} lessonId={data.id} />
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                  {(hasNextPage || isFetching) && <FullPageLoader />}
                  <div
                    ref={ref}
                    className="w-full h-10 mb-10 z-10 touch-none"
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
