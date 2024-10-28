'use client'

import { lessonFormState } from '@/atom'
import NextButton from '@/components/Form/NextButton'
import Stepper from '@/components/Form/Stepper'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil'

interface LessonFeatureProps {
  qualifications: string
  careerHistory: string
  hasFreeParking: boolean
}

export default function LessonRegisterFeature() {
  const router = useRouter()
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false)
  const [lessonForm, setLessonForm] = useRecoilState(lessonFormState)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LessonFeatureProps>()

  const onSubmit = (data: LessonFeatureProps) => {
    setLessonForm({
      ...lessonForm,
      qualifications: data.qualifications,
      careerHistory: data.careerHistory,
      hasFreeParking: data.hasFreeParking,
    })
    router.push('/lesson/register/location')
  }

  useEffect(() => {
    if (lessonForm) {
      setValue('qualifications', lessonForm?.qualifications)
      setValue('careerHistory', lessonForm?.careerHistory)
      setValue('hasFreeParking', lessonForm?.hasFreeParking)
    }
  }, [lessonForm, setValue])

  return (
    <>
      <Stepper count={3} />
      <form
        className="mt-10 flex flex-col gap-6 px-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-semibold text-lg md:text-2xl text-center">
          자격사항과 경력을 입력해주세요
        </h1>

        <div className="flex flex-col gap-2">
          <label htmlFor="qualifications" className="text-lg font-semibold">
            자격사항
          </label>
          <textarea
            rows={4}
            {...register('qualifications', { required: true })}
            className="outline-none px-4 py-2 rounded-lg border-2 focus:border-black resize-none"
            placeholder="보유하신 자격증이나 수상 경력을 작성해주세요"
          />
          {errors.qualifications?.type === 'required' && (
            <span className="text-red-600 text-sm">필수 항목입니다.</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="careerHistory" className="text-lg font-semibold">
            경력사항
          </label>
          <textarea
            rows={4}
            {...register('careerHistory', { required: true })}
            className="outline-none px-4 py-2 rounded-lg border-2 focus:border-black resize-none"
            placeholder="볼링 관련 경력을 상세히 작성해주세요"
          />
          {errors.careerHistory?.type === 'required' && (
            <span className="text-red-600 text-sm">필수 항목입니다.</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="relative flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('hasFreeParking')}
              className="hidden"
            />
            <div
              className={`border-2 rounded-md px-4 py-2 w-full hover:bg-black/5 ${
                watch('hasFreeParking') ? 'border-black' : ''
              }`}
            >
              <span className="text-lg font-semibold">무료 주차 제공</span>
            </div>
          </label>
        </div>

        <NextButton type="submit" disabled={isSubmitting || disableSubmit} />
      </form>
    </>
  )
}
