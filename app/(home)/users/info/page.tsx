'use client'

import { UserType } from '@/interface'
import { signOut, useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { fetchUserInfo } from '@/lib/api'

export default function UserInfoPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('Session status:', status)
    console.log('Session data:', session)
  }, [session, status])

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<UserType, Error>('user', fetchUserInfo, {
    enabled: status === 'authenticated',
    retry: false,
    onError: (error) => {
      console.error('Error fetching user data:', error)
      setError(error.message || 'Failed to fetch user data')
    },
  })

  if (status === 'loading') return <div>Loading session...</div>
  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }
  if (isLoading) return <div>Loading user information...</div>
  if (isError)
    return <div>Error: {error || 'An unexpected error occurred'}</div>
  if (!user) return <div>No user data available</div>

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
        <InfoItem title="이메일" value={user.email} />
        <InfoItem title="닉네임" value={user.nickname} />
        <InfoItem title="이름" value={user.name} />
        <div className="flex flex-col gap-2 border-b-gray-200 border-b py-4">
          <h1 className="font-semibold">이미지</h1>
          <Image
            src={user.image || '/images/bowling-profile.png'}
            width={50}
            height={50}
            alt="user img"
            className="rounded-lg shadow"
            unoptimized
          />
        </div>
        <InfoItem title="도시" value={user.city} />
        <InfoItem title="나이" value={user.age?.toString()} />
        <InfoItem title="전화번호" value={user.phonenum} />
        <InfoItem title="성별" value={user.sex} />
        <InfoItem title="소개" value={user.introduction} />
        <InfoItem title="역할" value={user.role} />
        <InfoItem title="소셜 로그인 타입" value={user.socialType} />
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

const InfoItem = ({
  title,
  value,
}: {
  title: string
  value: string | null | undefined
}) => (
  <div className="flex flex-col gap-2 border-b-gray-200 border-b py-4">
    <h1 className="font-semibold">{title}</h1>
    <div className="text-gray-500 text-sm">{value || '-'}</div>
  </div>
)
