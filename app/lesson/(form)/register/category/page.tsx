'use client'

import { lessonFormState } from '@/atom'
import NextButton from '@/components/Form/NextButton'
import Stepper from '@/components/Form/Stepper'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

const PROGRAM_OPTIONS = ['STROKER', 'CRANKER', 'TWOHAND', 'DUMBLESS']
const CATEGORY_OPTIONS = ['프로', '실업', '일반']

export default function LessonRegisterCategory() {
  const router = useRouter()
  const [lessonForm, setLessonForm] = useRecoilState(lessonFormState)
  const [selectedProgram, setSelectedProgram] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false)

  const handleSubmit = () => {
    setLessonForm({
      ...lessonForm,
      program: selectedProgram,
      category: selectedCategory,
    })
    router.push('/lesson/register/info')
  }

  useEffect(() => {
    setSelectedProgram(lessonForm?.program || '')
    setSelectedCategory(lessonForm?.category || '')
  }, [lessonForm])

  return (
    <>
      <Stepper count={1} />
      <section className="mt-10 flex flex-col gap-8">
        <div>
          <h1 className="font-semibold text-lg md:text-2xl text-center mb-8">
            본인의 볼링 구질을 선택해주세요
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-10">
            {PROGRAM_OPTIONS.map((program) => (
              <button
                type="button"
                key={program}
                onClick={() => setSelectedProgram(program)}
                className={`border-2 hover:bg-black/5 rounded-md px-6 py-4 ${
                  selectedProgram === program ? 'border-2 border-black' : ''
                }`}
              >
                <h1 className="font-semibold text-lg">{program}</h1>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="font-semibold text-lg md:text-2xl text-center mb-8">
            레슨 카테고리를 선택해주세요
          </h1>
          <div className="grid grid-cols-3 gap-4 px-10">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`border-2 hover:bg-black/5 rounded-md px-6 py-4 ${
                  selectedCategory === category ? 'border-2 border-black' : ''
                }`}
              >
                <h1 className="font-semibold text-lg">{category}</h1>
              </button>
            ))}
          </div>
        </div>
      </section>
      <NextButton
        disabled={!selectedProgram || !selectedCategory || disableSubmit}
        onClick={handleSubmit}
      />
    </>
  )
}
