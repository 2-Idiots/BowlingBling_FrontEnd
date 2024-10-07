'use client'

import { filterState } from '@/atom'
import { useRecoilState } from 'recoil'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import Calendar from 'react-calendar'
import { useState, useEffect } from 'react'
import { LessonType } from '@/interface'

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

export default function CalendarSection({ data }: { data?: LessonType }) {
  const [showCalendar, setShowCalendar] = useState<boolean>(false)
  const [filterValue, setFilterValue] = useRecoilState(filterState)

  const timeSlots = data?.operatingHours
    ? data.operatingHours.split(',').map((slot) => slot.trim())
    : [
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
      ]

  const onChangeDate = (value: Value) => {
    if (value instanceof Date) {
      const formattedDate = dayjs(value).format('YYYY-MM-DD')
      setFilterValue((prev) => ({
        ...prev,
        date: formattedDate,
        time: '', // Reset time when date changes
      }))
    }
  }

  const onChangeTime = (time: string) => {
    setFilterValue((prev) => ({
      ...prev,
      time: time,
    }))
  }

  useEffect(() => {
    setShowCalendar(true)
  }, [])

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="text-gray-500 text-sm">
        {filterValue.date
          ? `선택된 날짜: ${filterValue.date}`
          : '레슨 날짜를 선택해주세요'}
      </div>
      {showCalendar && (
        <div className="flex flex-col gap-4">
          <Calendar
            next2Label={null}
            prev2Label={null}
            className="mt-4 mx-auto"
            onChange={onChangeDate}
            value={filterValue.date ? new Date(filterValue.date) : null}
            minDate={new Date()}
            formatDay={(locale, date) => dayjs(date).format('DD')}
          />
          {filterValue.date && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">레슨 시간 선택</h3>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => onChangeTime(time)}
                    className={`px-2 py-1 text-xs rounded-md ${
                      filterValue.time === time
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
        </div>
      )}
    </div>
  )
}
