'use client'

import { useState, useEffect } from 'react'
import { filterState } from '@/atom'
import { LessonBookingRequest, LessonType, BookedTimeSlot } from '@/interface'
import { useRecoilState } from 'recoil'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { createLessonBooking, fetchLessonBookedDates } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useQuery, useQueryClient } from 'react-query'

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
  const queryClient = useQueryClient()
  const router = useRouter()
  const [filterValue, setFilterValue] = useRecoilState(filterState)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 예약된 시간 슬롯 조회를 위한 쿼리 키를 상수로 정의
  const BOOKED_SLOTS_QUERY_KEY = ['booked-slots', data.id]

  // 예약된 시간 슬롯 조회
  const { data: bookedSlots, isError: isSlotsError } = useQuery<
    BookedTimeSlot[]
  >(BOOKED_SLOTS_QUERY_KEY, () => fetchLessonBookedDates(data.id), {
    enabled: !!data.id,
    onError: (error) => {
      console.error('Failed to fetch booked slots:', error)
      toast.error('예약된 시간 정보를 불러오는데 실패했습니다.')
    },
  })

  useEffect(() => {
    setSelectedDate(filterValue.date || null)
    setSelectedTime(filterValue.time || null)
  }, [filterValue.date, filterValue.time])

  const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    setSelectedDate(date)
    setSelectedTime(null)
    setFilterValue((prev) => ({
      ...prev,
      date: date,
      time: '',
    }))
  }

  const isTimeSlotBooked = (time: string) => {
    if (!bookedSlots) return false
    return bookedSlots.some(
      (slot) => slot.date === selectedDate && slot.time === time,
    )
  }

  const onChangeTime = (time: string) => {
    if (isTimeSlotBooked(time)) return
    setSelectedTime(time)
    setFilterValue((prev) => ({
      ...prev,
      time: time,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!data?.id) {
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

    try {
      setIsLoading(true)
      await createLessonBooking(bookingData)

      // 예약 성공 후 캐시 데이터 즉시 업데이트
      queryClient.setQueryData<BookedTimeSlot[]>(
        BOOKED_SLOTS_QUERY_KEY,
        (oldData) => {
          if (!oldData) return [{ date: selectedDate, time: selectedTime }]
          return [...oldData, { date: selectedDate, time: selectedTime }]
        },
      )

      toast.success('레슨이 성공적으로 예약되었습니다!')

      // 추가로 데이터 재검증
      queryClient.invalidateQueries(BOOKED_SLOTS_QUERY_KEY)

      router.push(`/lesson/${data.id}`)
    } catch (error: any) {
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
                {timeSlots.map((time) => {
                  const isBooked = isTimeSlotBooked(time)
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => onChangeTime(time)}
                      disabled={isBooked}
                      className={`px-2 py-1 text-xs rounded-md ${
                        isBooked
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed relative group'
                          : selectedTime === time
                            ? 'bg-rose-500 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                      {isBooked && (
                        <span
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 
                          bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100
                          transition-opacity duration-200 whitespace-nowrap"
                        >
                          예약됨
                        </span>
                      )}
                    </button>
                  )
                })}
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
