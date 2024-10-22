'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { createComment } from '@/lib/api'
import { LessonType } from '@/interface'

export default function CommentForm({ data }: { data: LessonType }) {
  const [comment, setComment] = useState<string>('')
  const { status } = useSession()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (comments: string) => createComment(data.id, comments),
    {
      onSuccess: () => {
        toast.success('댓글을 작성했습니다.')
        setComment('')
        queryClient.invalidateQueries(['lesson-comments', data.id])
      },
      onError: () => {
        toast.error('댓글 작성에 실패했습니다.')
      },
    },
  )

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error('댓글 내용을 입력해주세요.')
      return
    }
    mutation.mutate(comment)
  }

  if (status !== 'authenticated') {
    return null
  }

  return (
    <div className="mt-8">
      <textarea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="댓글을 작성해주세요..."
        className="w-full block min-h-[120px] resize-none border rounded-md bg-transparent py-2.5 px-4 placeholder:text-gray-400 text-sm leading-6 outline-none focus:border-black"
      />
      <div className="flex flex-row-reverse mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={mutation.isLoading}
          className="bg-rose-600 hover:bg-rose-500 text-white px-8 py-2.5 text-sm font-semibold shadow-sm rounded-md disabled:bg-gray-400"
        >
          {mutation.isLoading ? '작성 중...' : '작성하기'}
        </button>
      </div>
    </div>
  )
}
