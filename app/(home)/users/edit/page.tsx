'use client'

import React, { useState, useEffect } from 'react'
import { UserType } from '@/interface'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { FullPageLoader } from '@/components/Loader'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function UserEditPage() {
  const router = useRouter()
  // const { status } = useSession()
  const status = 'authenticated' // 임시로 인증된 상태로 설정

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phonenum, setPhonenum] = useState<string>('')
  const [city, setCity] = useState<string>('')

  // 더미 데이터를 반환하는 임시 함수
  const fetchUser = async () => {
    // 실제 API 호출 대신 더미 데이터 반환
    return {
      name: '이찬호',
      email: 'cksgh5477@gmail.com',
      phonenum: '010-1234-5678',
      city: '성남시',
    } as UserType
  }

  const { data: user, isSuccess } = useQuery('user-form', fetchUser, {
    enabled: status === 'authenticated',
    refetchOnMount: false,
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e

    if (name === 'name') {
      setName(value)
    }
    if (name === 'email') {
      setEmail(value)
    }
    if (name === 'phonenum') {
      setPhonenum(value)
    }
    if (name === 'city') {
      setCity(value)
    }
  }

  const updateUser = async () => {
    // 실제 API 호출 대신 콘솔에 로그 출력
    console.log('Updating user with:', { name, email, phonenum, city })
    toast.success('정보를 수정했습니다 (테스트)')
    // router.replace('/users/info')  // 실제 리다이렉트는 주석 처리
  }

  useEffect(() => {
    if (user && isSuccess) {
      setName(user?.name || '')
      setEmail(user?.email || '')
      setPhonenum(user?.phonenum || '')
      setCity(user?.city || '')
    }
  }, [user, isSuccess])

  return user ? (
    <form>
      <div className="space-y-12 max-w-3xl mx-auto">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-2xl font-semibold leading-7 text-gray-900">
            개인정보 수정 (테스트 모드)
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            개인정보를 수정해주세요
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                이름
              </label>
              <div className="mt-2">
                <input
                  onChange={onChange}
                  value={name}
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="phonenum"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                전화번호
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={phonenum}
                  onChange={onChange}
                  name="phonenum"
                  id="phonenum"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                이메일
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  value={email}
                  onChange={onChange}
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                도시
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={city}
                  onChange={onChange}
                  name="city"
                  id="city"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6 max-w-3xl mx-auto">
        <button
          type="button"
          onClick={updateUser}
          className="rounded-md bg-rose-600 px-16 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          수정하기 (테스트)
        </button>
      </div>
    </form>
  ) : (
    <FullPageLoader />
  )
}
