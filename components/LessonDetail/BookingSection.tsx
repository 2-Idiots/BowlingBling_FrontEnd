'use client'

import { useState, useEffect } from 'react'
import { filterState } from '@/atom'
import { LessonBookingRequest, LessonType } from '@/interface'
import { useRecoilState } from 'recoil'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { createLessonBooking } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

const timeSlots = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
]

export default function BookingSection({ data }: { data: LessonType }) {
  const router = useRouter()
  const [filterValue, setFilterValue] = useRecoilState(filterState)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setSelectedDate(filterValue.date || null)
    setSelectedTime(filterValue.time || null)
  }, [filterValue.date, filterValue.time])

  const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    setSelectedDate(date)
    setFilterValue((prev) => ({
      ...prev,
      date: date,
      time: '',
    }))
  }

  const onChangeTime = (time: string) => {
    setSelectedTime(time)
    setFilterValue((prev) => ({
      ...prev,
      time: time,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!data?.id) {
      console.error('Lesson ID is missing:', data)
      toast.error('레슨 정보를 찾을 수 없습니다.')
      return
    }

    if (!selectedDate || !selectedTime) {
      toast.error('날짜와 시간을 선택해주세요.')
      return
    }

    const bookingData: LessonBookingRequest = {
      lessonid: data.id,
      date: selectedDate,
      time: selectedTime,
    }

    console.log('Submitting booking data:', bookingData)

    try {
      setIsLoading(true)
      const response = await createLessonBooking(bookingData)
      toast.success('레슨이 성공적으로 예약되었습니다!')
      router.push(`/lesson/${data.id}`)
    } catch (error: any) {
      console.error('Booking error details:', error.response?.data)
      const errorMessage =
        error.response?.data?.message ||
        '레슨 예약에 실패했습니다. 다시 시도해주세요.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mt-8 shadow-lg rounded-lg border border-gray-300 px-6 py-8 md:sticky md:top-20">
        <div className="text-gray-600 flex justify-between items-center">
          <div>
            <span className="font-semibold text-lg md:text-xl text-black">
              {data?.price?.toLocaleString()} 원
            </span>{' '}
            /레슨
          </div>
          <div className="text-xs">후기 {data.user?.Lesson?.length || 0}개</div>
        </div>
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="mt-2">
            <label className="text-xs font-semibold">레슨 날짜</label>
            <input
              type="date"
              value={selectedDate || ''}
              min={dayjs().format('YYYY-MM-DD')}
              className="w-full px-4 py-3 border border-gray-400 rounded-md text-xs mt-1"
              onChange={onChangeDate}
            />
          </div>
          {selectedDate && (
            <div className="mt-2">
              <label className="text-xs font-semibold">레슨 시간</label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => onChangeTime(time)}
                    className={`px-2 py-1 text-xs rounded-md ${
                      selectedTime === time
                        ? 'bg-rose-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-6">
            <button
              type="submit"
              className={`bg-rose-500 hover:bg-rose-600 text-white rounded-md py-2.5 w-full ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!selectedDate || !selectedTime || isLoading}
            >
              {isLoading ? '예약 처리중...' : '레슨 예약하기'}
            </button>
            <p className="text-center text-gray-600 mt-4 text-xs md:text-sm">
              예약 확정에는 요금이 청구되지 않습니다.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
