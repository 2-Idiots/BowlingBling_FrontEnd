'use client'

import { filterState } from '@/atom'
import { useRecoilState } from 'recoil'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import Calendar from 'react-calendar'
import { useState, useEffect } from 'react'
import { LessonType, BookedTimeSlot } from '@/interface'
import { fetchLessonBookedDates } from '@/lib/api'
import { useQuery } from 'react-query'
import { toast } from 'react-hot-toast'

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

export default function CalendarSection({ data }: { data?: LessonType }) {
  const [showCalendar, setShowCalendar] = useState<boolean>(false)
  const [filterValue, setFilterValue] = useRecoilState(filterState)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const BOOKED_SLOTS_QUERY_KEY = ['booked-slots', data?.id]

  const { data: bookedSlots } = useQuery<BookedTimeSlot[]>(
    BOOKED_SLOTS_QUERY_KEY,
    () => fetchLessonBookedDates(data!.id),
    {
      enabled: !!data?.id,
      onSuccess: (data) => {
        // console.log('Fetched booked slots:', data)
      },
      onError: (error) => {
        console.error('Failed to fetch booked slots:', error)
        toast.error('예약된 시간 정보를 불러오는데 실패했습니다.')
      },
    },
  )

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

  useEffect(() => {
    setSelectedDate(filterValue.date || null)
    setSelectedTime(filterValue.time || null)
  }, [filterValue.date, filterValue.time])

  const onChangeDate = (value: Value) => {
    if (value instanceof Date) {
      const formattedDate = dayjs(value).format('YYYY-MM-DD')
      setSelectedDate(formattedDate)
      setSelectedTime(null)
      setFilterValue((prev) => ({
        ...prev,
        date: formattedDate,
        time: '',
      }))
    }
  }

  const isTimeSlotBooked = (time: string) => {
    // console.log('Checking time slot:', time, 'for date:', selectedDate)
    // console.log('Current booked slots:', bookedSlots)

    if (!bookedSlots || !selectedDate) return false

    const isBooked = bookedSlots.some((slot) => {
      const matches = slot.date === selectedDate && slot.time === time
      // console.log(
      //   `Comparing - Date: ${slot.date} === ${selectedDate}, Time: ${slot.time} === ${time}, Matches: ${matches}`,
      // )
      return matches
    })

    // console.log(`Time slot ${time} is booked:`, isBooked)
    return isBooked
  }

  const onChangeTime = (time: string) => {
    const isBooked = isTimeSlotBooked(time)
    console.log(`Attempting to select time ${time}, isBooked: ${isBooked}`)

    if (isBooked) {
      toast.error('이미 예약된 시간입니다.')
      return
    }

    setSelectedTime(time)
    setFilterValue((prev) => ({
      ...prev,
      time: time,
    }))
  }

  useEffect(() => {
    setShowCalendar(true)
  }, [])

  // bookedSlots가 변경될 때마다 로그
  useEffect(() => {
    console.log('BookedSlots updated:', bookedSlots)
  }, [bookedSlots])

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="text-gray-500 text-sm">
        {selectedDate
          ? `선택된 날짜: ${selectedDate}`
          : '레슨 날짜를 선택해주세요'}
      </div>
      {showCalendar && (
        <div className="flex flex-col gap-4">
          <Calendar
            next2Label={null}
            prev2Label={null}
            className="mt-4 mx-auto"
            onChange={onChangeDate}
            value={selectedDate ? new Date(selectedDate) : null}
            minDate={new Date()}
            formatDay={(locale, date) => dayjs(date).format('DD')}
          />
          {selectedDate && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">레슨 시간 선택</h3>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => {
                  const isBooked = isTimeSlotBooked(time)
                  return (
                    <button
                      key={time}
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
        </div>
      )}
    </div>
  )
}
