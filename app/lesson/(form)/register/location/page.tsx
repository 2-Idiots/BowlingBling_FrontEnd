'use client'

import { lessonFormState } from '@/atom'
import NextButton from '@/components/Form/NextButton'
import Stepper from '@/components/Form/Stepper'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil'

interface LessonLocationProps {
  location: string
  place: string
}

export default function LessonRegisterLocation() {
  const router = useRouter()
  const [lessonForm, setLessonForm] = useRecoilState(lessonFormState)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LessonLocationProps>()

  const onSubmit = (data: LessonLocationProps) => {
    setLessonForm({
      ...lessonForm,
      location: data.location,
      place: data.place,
    })
    router.push('/lesson/register/image')
  }

  useEffect(() => {
    if (lessonForm) {
      setValue('location', lessonForm.location)
      setValue('place', lessonForm.place)
    }
  }, [lessonForm, setValue])

  return (
    <>
      <Stepper count={4} />
      <form
        className="mt-10 flex flex-col gap-6 px-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-semibold text-lg md:text-2xl text-center">
          레슨 위치 정보를 입력해주세요
        </h1>

        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="text-lg font-semibold">
            레슨 주소
          </label>
          <input
            {...register('location', { required: true })}
            className="outline-none px-4 py-2 rounded-lg border-2 focus:border-black"
            placeholder="예: 서울특별시 강남구 테헤란로 123"
          />
          {errors.location?.type === 'required' && (
            <span className="text-red-600 text-sm">필수 항목입니다.</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="place" className="text-lg font-semibold">
            장소명
          </label>
          <input
            {...register('place', { required: true })}
            className="outline-none px-4 py-2 rounded-lg border-2 focus:border-black"
            placeholder="예: OO볼링장"
          />
          {errors.place?.type === 'required' && (
            <span className="text-red-600 text-sm">필수 항목입니다.</span>
          )}
        </div>

        <NextButton type="submit" />
      </form>
    </>
  )
}
