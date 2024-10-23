'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useSession, getSession } from 'next-auth/react' // getSession import 추가
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { CommentType } from '@/interface'
import { updateComment, deleteComment } from '@/lib/api'
import { HiDotsVertical } from 'react-icons/hi'

export default function CommentItem({
  comment,
  lessonId,
}: {
  comment: CommentType
  lessonId: number
}) {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [editedComment, setEditedComment] = useState(comment.comments)
  const [showMenu, setShowMenu] = useState(false)
  const queryClient = useQueryClient()
  const menuRef = useRef<HTMLDivElement>(null)

  // 디버깅을 위한 전체 세션 데이터 출력
  console.log('Full session data:', session)

  // 현재 로그인한 사용자가 댓글 작성자인지 확인
  const isAuthor = useMemo(() => {
    console.log('Checking author:', {
      sessionName: session?.user?.name,
      memberName: comment.memberName,
    })

    if (!session?.user?.name || !comment.memberName) return false
    return session.user.name.toLowerCase() === comment.memberName.toLowerCase()
  }, [session?.user?.name, comment.memberName])

  const updateMutation = useMutation(
    async () => {
      console.log('Running update mutation')
      const result = await updateComment(lessonId, comment.id, editedComment)
      console.log('Update result:', result)
      return result
    },
    {
      onSuccess: () => {
        toast.success('댓글이 수정되었습니다.')
        setIsEditing(false)
        queryClient.invalidateQueries(['lesson-comments', lessonId])
        queryClient.invalidateQueries([`lesson-${lessonId}-comments-infinite`])
      },
      onError: (error) => {
        console.error('Update mutation error:', error)
        toast.error('댓글 수정에 실패했습니다.')
      },
    },
  )

  const deleteMutation = useMutation(
    async () => {
      console.log('Starting delete mutation for:', {
        lessonId,
        commentId: comment.id,
      })
      try {
        const result = await deleteComment(lessonId, comment.id)
        console.log('Delete result:', result)
        return result
      } catch (error) {
        console.error('Delete API error:', error)
        throw error
      }
    },
    {
      onMutate: () => {
        console.log('Delete mutation starting...')
      },
      onSuccess: () => {
        console.log('Delete successful')
        toast.success('댓글이 삭제되었습니다.')
        queryClient.invalidateQueries(['lesson-comments', lessonId])
        queryClient.invalidateQueries([`lesson-${lessonId}-comments-infinite`])
      },
      onError: (error) => {
        console.error('Delete mutation error:', error)
        toast.error('댓글 삭제에 실패했습니다.')
      },
      onSettled: () => {
        console.log('Delete mutation settled')
      },
    },
  )

  const handleDelete = async () => {
    try {
      if (window.confirm('댓글을 삭제하시겠습니까?')) {
        console.log('Delete confirmed for comment:', comment.id)
        await deleteMutation.mutateAsync()
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleUpdate = async () => {
    console.log('handleUpdate called')
    try {
      if (!editedComment.trim()) {
        toast.error('댓글 내용을 입력해주세요.')
        return
      }

      console.log('Updating comment with data:', {
        lessonId,
        commentId: comment.id,
        newContent: editedComment,
      })

      await updateMutation.mutateAsync()
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  // 메뉴 외부 클릭시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      // 이벤트 리스너 등록 시점을 지연시켜 버블링 문제 해결
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 0)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="flex gap-2 items-center">
          <Image
            src={comment?.image || '/images/bowling-profile.png'}
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
        {/* 작성자인 경우에만 수정/삭제 메뉴 표시 */}
        {isAuthor && (
          <div className="relative menu-container" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setShowMenu(!showMenu)
                console.log('Menu button clicked')
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <HiDotsVertical className="text-gray-500" />
            </button>
            {showMenu && (
              <div
                className="absolute right-0 mt-1 py-1 w-24 bg-white rounded-md shadow-lg border z-[200]"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    console.log('Edit button clicked')
                    setIsEditing(true)
                    setShowMenu(false)
                  }}
                  className="block w-full px-4 py-1 text-sm text-left hover:bg-gray-100"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    console.log('Delete button clicked')
                    handleDelete()
                    setShowMenu(false)
                  }}
                  className="block w-full px-4 py-1 text-sm text-left text-red-600 hover:bg-gray-100"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            className="w-full min-h-[100px] p-2 border rounded-md resize-none focus:outline-none focus:border-gray-400"
            placeholder="댓글을 입력하세요..."
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false)
                setEditedComment(comment.comments)
              }}
              className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-100"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className="px-3 py-1.5 text-sm text-white bg-rose-600 rounded-md hover:bg-rose-500"
            >
              수정완료
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-600 break-words">{comment.comments}</div>
      )}
    </div>
  )
}
