import { BookedLesson } from '@/interface'
import Link from 'next/link'

export const BookedLessonItem = ({ lesson }: { lesson: BookedLesson }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-500'
      case 'CONFIRMED':
        return 'text-green-500'
      case 'CANCELLED':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <Link href={`/lesson/${lesson.id}`}>
      <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-lg">{lesson.teacherName} 강사</h3>
            <span
              className={`${getStatusColor(lesson.status)} text-sm font-medium`}
            >
              {lesson.status === 'PENDING' && '승인 대기'}
              {lesson.status === 'CONFIRMED' && '승인 완료'}
              {lesson.status === 'CANCELLED' && '취소됨'}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>예약 날짜</span>
              <span>{lesson.date}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>예약 시간</span>
              <span>{lesson.time}</span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">레슨 비용</span>
                <span className="text-lg font-semibold text-rose-500">
                  {lesson.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
