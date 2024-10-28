'use client'

import { lessonFormState } from '@/atom'
import NextButton from '@/components/Form/NextButton'
import Stepper from '@/components/Form/Stepper'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil'

interface LessonInfoProps {
  title: string
  introduction: string
  contents: string
  qualifications: string
  operatingHours: string
}

export default function LessonRegisterInfo() {
  const router = useRouter()
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false)
  const [lessonForm, setLessonForm] = useRecoilState(lessonFormState)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LessonInfoProps>()

  const onSubmit = (data: LessonInfoProps) => {
    setLessonForm({
      ...lessonForm,
      title: data.title,
      introduction: data.introduction,
      contents: data.contents,
      qualifications: data.qualifications,
      operatingHours: data.operatingHours,
    })
    router.push('/lesson/register/location') // 다음 단계로 이동
  }

  useEffect(() => {
    if (lessonForm) {
      setValue('title', lessonForm?.title)
      setValue('introduction', lessonForm?.introduction)
      setValue('contents', lessonForm?.contents)
      setValue('qualifications', lessonForm?.qualifications)
      setValue('operatingHours', lessonForm?.operatingHours)
    }
  }, [lessonForm, setValue])

  return (
    <>
      <Stepper count={2} />
      <form
        className="mt-10 flex flex-col gap-6 px-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-semibold text-lg md:text-2xl text-center">
          레슨에 대한 상세 정보를 입력해주세요
        </h1>

        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-lg font-semibold">
            레슨 제목
          </label>
          <input
            {...register('title', { required: true, maxLength: 50 })}
            className="outline-none px-4 py-2 rounded-lg border-2 focus:border-black"
          />
          {errors.title?.type === 'required' && (
            <span className="text-red-600 text-sm">필수 항목입니다.</span>
          )}
          {errors.title?.type === 'maxLength' && (
            <span className="text-red-600 text-sm">
              제목은 50자 이내로 작성해주세요.
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="introduction" className="text-lg font-semibold">
            소개
          </label>
          <textarea
            rows={2}
            {...register('introduction', { required: true, maxLength: 100 })}
            className="outline-none px-4 py-2 rounded-lg border-2 focus:border-black resize-none"
            placeholder="레슨에 대한 간단한 소개를 작성해주세요"
          />
          {errors.introduction?.type === 'required' && (
            <span className="text-red-600 text-sm">필수 항목입니다.</span>
          )}
          {errors.introduction?.type === 'maxLength' && (
            <span className="text-red-600 text-sm">
              소개는 100자 이내로 작성해주세요.
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contents" className="text-lg font-semibold">
            레슨 상세 내용
          </label>
          <textarea
            rows={4}
            {...register('contents', { required: true })}
            className="outline-none px-4 py-2 rounded-lg border-2 focus:border-black resize-none"
            placeholder="레슨 진행 방식, 커리큘럼 등 상세한 내용을 작성해주세요"
          />
          {errors.contents?.type === 'required' && (
            <span className="text-red-600 text-sm">필수 항목입니다.</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="qualifications" className="text-lg font-semibold">
            자격 및 경력사항
          </label>
          <textarea
            rows={3}
            {...register('qualifications', { required: true })}
            className="outline-none px-4 py-2 rounded-lg border-2 focus:border-black resize-none"
            placeholder="보유한 자격증, 수상 경력, 교육 이력 등을 작성해주세요"
          />
          {errors.qualifications?.type === 'required' && (
            <span className="text-red-600 text-sm">필수 항목입니다.</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="operatingHours" className="text-lg font-semibold">
            운영 시간
          </label>
          <input
            {...register('operatingHours', { required: true })}
            className="outline-none px-4 py-2 rounded-lg border-2 focus:border-black"
            placeholder="예: 평일 10:00-18:00"
          />
          {errors.operatingHours?.type === 'required' && (
            <span className="text-red-600 text-sm">필수 항목입니다.</span>
          )}
        </div>

        <NextButton type="submit" disabled={isSubmitting || disableSubmit} />
      </form>
    </>
  )
}
