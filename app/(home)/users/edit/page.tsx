'use client'

import React, { useState, useEffect } from 'react'
import { UserType, UserProfileUpdateType } from '@/interface'
import { useSession } from 'next-auth/react'
import { useQuery, useMutation } from 'react-query'
import { FullPageLoader } from '@/components/Loader'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { fetchUserInfo, updateUserProfile } from '@/lib/api'
import Image from 'next/image'
import axios from 'axios'

export default function UserEditPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [formData, setFormData] = useState<UserProfileUpdateType>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { data: user, isSuccess } = useQuery('user', fetchUserInfo, {
    enabled: status === 'authenticated',
    refetchOnMount: false,
  })

  const updateMutation = useMutation(
    (data: { userData: UserProfileUpdateType; file?: File }) =>
      updateUserProfile(data.userData, data.file),
    {
      onSuccess: () => {
        toast.success('정보를 수정했습니다')
        router.push('/users/info')
      },
      onError: (error: any) => {
        console.error('Update error:', error)
        toast.error(`오류: ${error.message || '정보 수정에 실패했습니다'}`)
      },
    },
  )

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('이미지 크기는 5MB를 초과할 수 없습니다.')
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateMutation.mutateAsync({
        userData: formData,
        file: imageFile || undefined,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Update error:', error.response?.data || error.message)
        toast.error(
          `오류: ${
            error.response?.data?.message ||
            error.message ||
            '정보 수정에 실패했습니다'
          }`,
        )
      } else {
        console.error('Unexpected error:', error)
        toast.error('알 수 없는 오류가 발생했습니다')
      }
    }
  }

  useEffect(() => {
    if (user && isSuccess) {
      setFormData({
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        phonenum: user.phonenum,
        city: user.city,
        sex: user.sex,
        age: user.age,
        introduction: user.introduction,
      })
      setImagePreview(user.image || null)
    }
  }, [user, isSuccess])

  if (status === 'loading' || !user) return <FullPageLoader />

  return (
    <form onSubmit={updateUser}>
      {/* 폼 필드들... */}
      <div className="space-y-12 max-w-3xl mx-auto">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-2xl font-semibold leading-7 text-gray-900">
            개인정보 수정
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            개인정보를 수정해주세요
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* 이메일 필드 */}
            <div className="sm:col-span-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                이메일
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email || ''}
                  onChange={onChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* 이름 필드 */}
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                이름
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name || ''}
                  onChange={onChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* 닉네임 필드 */}
            <div className="sm:col-span-3">
              <label
                htmlFor="nickname"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                닉네임
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="nickname"
                  id="nickname"
                  value={formData.nickname || ''}
                  onChange={onChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* 전화번호 필드 */}
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
                  name="phonenum"
                  id="phonenum"
                  value={formData.phonenum || ''}
                  onChange={onChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* 도시 필드 */}
            <div className="sm:col-span-3">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                도시
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city || ''}
                  onChange={onChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* 성별 필드 */}
            <div className="sm:col-span-3">
              <label
                htmlFor="sex"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                성별
              </label>
              <div className="mt-2">
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex || ''}
                  onChange={onChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="">선택하세요</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </div>
            </div>

            {/* 나이 필드 */}
            <div className="sm:col-span-3">
              <label
                htmlFor="age"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                나이
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="age"
                  id="age"
                  value={formData.age || ''}
                  onChange={onChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* 소개 필드 */}
            <div className="col-span-full">
              <label
                htmlFor="introduction"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                소개
              </label>
              <div className="mt-2">
                <textarea
                  id="introduction"
                  name="introduction"
                  rows={3}
                  value={formData.introduction || ''}
                  onChange={onChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* 프로필 이미지 필드 */}
            <div className="col-span-full">
              <label
                htmlFor="image"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                프로필 이미지
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                )}
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-rose-50 file:text-rose-600
                    hover:file:bg-rose-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => router.back()}
        >
          취소
        </button>
        <button
          type="submit"
          className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          disabled={updateMutation.isLoading}
        >
          {updateMutation.isLoading ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
}
