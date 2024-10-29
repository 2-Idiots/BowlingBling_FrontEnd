'use client'

import { lessonFormState } from '@/atom'
import NextButton from '@/components/Form/NextButton'
import Stepper from '@/components/Form/Stepper'
import { createLesson } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { AiFillCamera, AiOutlineClose } from 'react-icons/ai'
import toast from 'react-hot-toast'

interface LessonImageProps {
  imageUrls: FileList
}

interface PreviewImage {
  id: string
  url: string
  file: File
}

export default function LessonRegisterImage() {
  const router = useRouter()
  const [lessonForm, setLessonForm] = useRecoilState(lessonFormState)
  const resetLessonForm = useResetRecoilState(lessonFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonImageProps>()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e

    if (!files) return
    if (previewImages.length + files.length > 5) {
      toast.error('최대 5장까지만 업로드 가능합니다.')
      return
    }

    Array.from(files).forEach((file: File) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onloadend = (event: ProgressEvent<FileReader>) => {
        const { result } = event.target as FileReader
        if (result) {
          setPreviewImages((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(7),
              url: result.toString(),
              file: file,
            },
          ])
        }
      }
    })
  }

  const removeImage = (id: string) => {
    setPreviewImages((prev) => prev.filter((image) => image.id !== id))
  }

  const onSubmit = async (data: LessonImageProps) => {
    if (previewImages.length === 0) {
      toast.error('최소 1장의 이미지를 업로드해주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()

      // 레슨 데이터를 JSON 형태로 추가 (변경 없음)
      formData.append(
        'request',
        new Blob([JSON.stringify(lessonForm)], { type: 'application/json' }),
      )

      // 이미지 파일들 추가 (변경 없음)
      previewImages.forEach((image) => {
        formData.append('files', image.file)
      })

      await createLesson(formData)
      toast.success('레슨이 등록되었습니다.')
      resetLessonForm()
      router.push('/lesson/my')
    } catch (error: any) {
      console.error('레슨 등록 실패:', error)
      if (error.response?.status === 401) {
        toast.error('세션이 만료되었습니다. 다시 로그인해주세요.')
        router.push('/login')
        return
      }
      toast.error('레슨 등록에 실패했습니다. 다시 시도해주세요.')
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
                <AiFillCamera className="mx-auto h-12 w-12 text-gray-300" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-black hover:text-black/70 focus-within:outline-none focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2"
                  >
                    <span>최대 5장의 사진을</span>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      {...register('imageUrls', {
                        validate: {
                          acceptedFormats: (files) =>
                            !files ||
                            Array.from(files).every((file) =>
                              ['image/jpeg', 'image/png', 'image/gif'].includes(
                                file.type,
                              ),
                            ),
                        },
                      })}
                      onChange={handleFileUpload}
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
          {errors.imageUrls?.type === 'acceptedFormats' && (
            <span className="text-red-600 text-sm">
              허용되지 않는 파일 형식이 포함되어 있습니다.
            </span>
          )}
        </div>

        {previewImages.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {previewImages.map((image) => (
              <div key={image.id} className="relative">
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                >
                  <AiOutlineClose className="w-5 h-5" />
                </button>
                <img
                  src={image.url}
                  alt="미리보기"
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        )}

        <NextButton
          type="submit"
          text="완료"
          disabled={isSubmitting || previewImages.length === 0}
        />
      </form>
    </>
  )
}
