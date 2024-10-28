'use client'

import { lessonFormState } from '@/atom'
import NextButton from '@/components/Form/NextButton'
import Stepper from '@/components/Form/Stepper'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil'

interface LessonImageProps {
  imageUrls: FileList
}

export default function LessonRegisterImage() {
  const router = useRouter()
  const [lessonForm, setLessonForm] = useRecoilState(lessonFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonImageProps>()

  const onSubmit = async (data: LessonImageProps) => {
    setIsSubmitting(true)
    try {
      // 여기에서 이미지 업로드 및 최종 레슨 등록 API 호출
      // const formData = new FormData();
      // Array.from(data.imageUrls).forEach((file) => {
      //   formData.append('files', file);
      // });
      // formData.append('lessonData', JSON.stringify(lessonForm));
      // await createLesson(formData);

      // 성공 시 처리
      router.push('/lesson/my') // 또는 적절한 완료 페이지로 이동
    } catch (error) {
      console.error('레슨 등록 실패:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Stepper count={5} />
      <form
        className="mt-10 flex flex-col gap-6 px-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-semibold text-lg md:text-2xl text-center">
          레슨 사진을 등록해주세요
        </h1>
        <p className="text-sm md:text-base text-gray-500 text-center">
          레슨 사진은 최대 5장까지 추가할 수 있습니다.
        </p>

        <div className="flex flex-col gap-2">
          <div className="col-span-full">
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                  >
                    <span>최대 5장의 사진을</span>
                    <input
                      id="file-upload"
                      {...register('imageUrls', {
                        required: true,
                        validate: {
                          maxFiles: (files) => !files || files.length <= 5,
                          acceptedFormats: (files) =>
                            !files ||
                            Array.from(files).every((file) =>
                              ['image/jpeg', 'image/png', 'image/gif'].includes(
                                file.type,
                              ),
                            ),
                        },
                      })}
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">업로드 해주세요</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  PNG, JPG, GIF 등 이미지 포맷만 가능
                </p>
              </div>
            </div>
          </div>
          {errors.imageUrls?.type === 'required' && (
            <span className="text-red-600 text-sm">이미지를 선택해주세요.</span>
          )}
          {errors.imageUrls?.type === 'maxFiles' && (
            <span className="text-red-600 text-sm">
              최대 5장까지만 업로드 가능합니다.
            </span>
          )}
          {errors.imageUrls?.type === 'acceptedFormats' && (
            <span className="text-red-600 text-sm">
              허용되지 않는 파일 형식이 포함되어 있습니다.
            </span>
          )}
        </div>

        <NextButton type="submit" text="완료" disabled={isSubmitting} />
      </form>
    </>
  )
}
