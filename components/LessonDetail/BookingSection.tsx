'use client'

import { useState, useEffect } from 'react'
import { filterState } from '@/atom'
import { LessonType } from '@/interface'
import { useRecoilState } from 'recoil'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'

export default function BookingSection({ data }: { data: LessonType }) {
  const [filterValue, setFilterValue] = useRecoilState(filterState)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

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
      time: '', // Reset time when date changes
    }))
  }

  const onChangeTime = (time: string) => {
    setSelectedTime(time)
    setFilterValue((prev) => ({
      ...prev,
      time: time,
    }))
  }

  const onChangeStudents = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterValue((prev) => ({
      ...prev,
      students: Number(e.target.value),
    }))
  }

  // 시간 슬롯, 실제로는 data.operatingHours에서 가져와야함.
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
        <form className="mt-2">
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
          <div className="mt-2">
            <label className="text-xs font-semibold">인원</label>
            <select
              onChange={onChangeStudents}
              value={filterValue.students}
              className="w-full px-4 py-3 border border-gray-400 rounded-md text-xs mt-1"
            >
              {[...Array(5)]?.map((_, i) => (
                <option value={i + 1} key={i}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="bg-rose-500 hover:bg-rose-600 text-white rounded-md py-2.5 w-full"
              disabled={!selectedDate || !selectedTime}
            >
              레슨 예약하기
            </button>
            <p className="text-center text-gray-600 mt-4 text-xs md:text-sm">
              예약 확정 전에는 요금이 청구되지 않습니다.
            </p>
          </div>
        </form>
        <div className="mt-4 flex flex-col gap-2 border-b border-b-gray-300 pb-4 text-xs md:text-sm">
          <div className="flex justify-between">
            <div className="text-gray-600 underline underline-offset-4">
              {data?.price?.toLocaleString()} x {filterValue.students || 1}명
            </div>
            <div className="text-gray-500">
              ₩{(data?.price * (filterValue.students || 1)).toLocaleString()}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-gray-600 underline underline-offset-4">
              예약 수수료
            </div>
            <div className="text-gray-500">₩0</div>
          </div>
          <div className="flex justify-between mt-6">
            <div>총 합계</div>
            <div>
              ₩{(data?.price * (filterValue.students || 1)).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
