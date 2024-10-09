'use client'

import { UserType } from '@/interface'
import axios from 'axios'
import { signOut, useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UserInfoPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async () => {
    if (!session) {
      throw new Error('No session found')
    }

    try {
      const { data } = await axios.get('/users/info', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`, // 여기서 accessToken을 사용하여 인증
        },
      })
      return data as UserType
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'Failed to fetch user data')
      } else {
        setError('An unexpected error occurred')
      }
      throw error
    }
  }

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery('user', fetchUser, {
    enabled: !!session, // 세션이 존재할 때만 쿼리를 실행
    retry: false,
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error}</div>

  return (
    <div className="mt-10 max-w-3xl mx-auto px-4">
      <div className="flex justify-between gap-4">
        <h1 className="text-3xl font-semibold">개인정보</h1>
        <button
          onClick={() => router.push('/users/edit')}
          type="button"
          className="text-sm font-semibold underline px-4 py-1.5 rounded-md hover:bg-black/5"
        >
          수정하기
        </button>
      </div>
      <div className="flex flex-col mt-10 mb-28">
        <div className="flex flex-col gap-2 border-b-gray-200 border-b py-4">
          <h1 className="font-semibold">이름</h1>
          <div className="text-gray-500 text-sm">{user?.name || '-'}</div>
        </div>
        <div className="flex flex-col gap-2 border-b-gray-200 border-b py-4">
          <h1 className="font-semibold">이메일</h1>
          <div className="text-gray-500 text-sm">{user?.email || '-'}</div>
        </div>
        <div className="flex flex-col gap-2 border-b-gray-200 border-b py-4">
          <h1 className="font-semibold">이미지</h1>
          <img
            src={user?.image || '/images/user-icon.png'}
            width={50}
            height={50}
            alt="user img"
            className="rounded-lg shadow"
          />
        </div>
        <div className="flex flex-col gap-2 border-b-gray-200 border-b py-4">
          <h1 className="font-semibold">도시</h1>
          <div className="text-gray-500 text-sm">{user?.city || '-'}</div>
        </div>
        <div className="flex flex-col gap-2 border-b-gray-200 border-b py-4">
          <h1 className="font-semibold">전화번호</h1>
          <div className="text-gray-500 text-sm">{user?.phonenum || '-'}</div>
        </div>
        <div className="flex flex-col gap-2 border-b-gray-200 border-b py-4">
          <h1 className="font-semibold">로그인한 SNS</h1>
          <div className="text-gray-500 text-sm">{user?.socialType || '-'}</div>
        </div>
        <div className="flex flex-col gap-2 border-b-gray-200 border-b py-4">
          <h1 className="font-semibold">로그아웃</h1>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-gray-500 text-sm underline text-left inline-block hover:text-gray-700"
          >
            로그아웃하기
          </button>
        </div>
      </div>
    </div>
  )
}
