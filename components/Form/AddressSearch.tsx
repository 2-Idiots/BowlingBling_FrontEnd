'use client'

import { LessonType } from '@/interface'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import DaumPostcodeEmbed from 'react-daum-postcode'
import { useState } from 'react'
import axios from 'axios'

interface AddressProps {
  setValue: UseFormSetValue<{
    location: string
    place: string
    lat: string
    lng: string
  }>
  register: UseFormRegister<{
    location: string
    place: string
    lat: string
    lng: string
  }>
  errors: FieldErrors<{
    location: string
    place: string
    lat: string
    lng: string
  }>
}

export default function AddressSearch({
  register,
  errors,
  setValue,
}: AddressProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleComplete = async (data: any) => {
    let fullAddress = data.address
    let extraAddress = ''

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
    }

    // 카카오 주소 검색 API로 위도/경도 가져오기
    try {
      const response = await axios.get(
        'https://dapi.kakao.com/v2/local/search/address.json',
        {
          headers: {
            Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}`, // NEXT_PUBLIC_ 접두사 추가
          },
          params: {
            query: fullAddress,
          },
        },
      )

      if (response.data.documents.length > 0) {
        const { x, y } = response.data.documents[0]
        console.log('주소 정보:', {
          address: fullAddress,
          위도: y,
          경도: x,
          전체응답: response.data.documents[0],
        })
        setValue('location', fullAddress)
        setValue('lat', y) // 위도
        setValue('lng', x) // 경도
      }
    } catch (error) {
      console.error('주소 좌표 변환 실패:', error)
    }

    setIsOpen(false)
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <label htmlFor="location" className="text-lg font-semibold">
          레슨 주소
        </label>
        <div className="grid md:grid-cols-4 gap-6">
          <input
            readOnly
            placeholder="주소를 입력해주세요"
            {...register('location', { required: true })}
            className="col-span-3 block w-full outline-none px-4 py-2 rounded-lg border-2 focus:border-black placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setIsOpen((val) => !val)}
            className="bg-black hover:bg-black/70 py-1.5 px-2 rounded text-white"
          >
            주소 검색
          </button>
        </div>
        {errors.location?.type === 'required' && (
          <span className="text-red-600 text-sm">필수 항목입니다.</span>
        )}
      </div>
      {isOpen && (
        <div className="mt-4 border border-gray-300 w-full rounded-md p-2 max-w-lg mx-auto">
          <DaumPostcodeEmbed onComplete={handleComplete} />
        </div>
      )}

      <input type="hidden" {...register('lat')} />
      <input type="hidden" {...register('lng')} />
    </>
  )
}
