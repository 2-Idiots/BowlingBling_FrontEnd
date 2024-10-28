// import { BookedLesson } from '@/interface'
// import Link from 'next/link'

// export const BookedLessonItem = ({ lesson }: { lesson: BookedLesson }) => {
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'PENDING':
//         return 'text-yellow-500'
//       case 'CONFIRMED':
//         return 'text-green-500'
//       case 'CANCELLED':
//         return 'text-red-500'
//       default:
//         return 'text-gray-500'
//     }
//   }

//   return (
//     <Link href={`/lesson/${lesson.id}`}>
//       <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
//         <div className="p-6">
//           <div className="flex justify-between items-start mb-4">
//             <h3 className="font-semibold text-lg">{lesson.teacherName} 강사</h3>
//             <span
//               className={`${getStatusColor(lesson.status)} text-sm font-medium`}
//             >
//               {lesson.status === 'PENDING' && '승인 대기'}
//               {lesson.status === 'CONFIRMED' && '승인 완료'}
//               {lesson.status === 'CANCELLED' && '취소됨'}
//             </span>
//           </div>

//           <div className="space-y-2">
//             <div className="flex justify-between text-gray-600">
//               <span>예약 날짜</span>
//               <span>{lesson.date}</span>
//             </div>
//             <div className="flex justify-between text-gray-600">
//               <span>예약 시간</span>
//               <span>{lesson.time}</span>
//             </div>
//             <div className="pt-4 border-t">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">레슨 비용</span>
//                 <span className="text-lg font-semibold text-rose-500">
//                   {lesson.price.toLocaleString()}원
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   )
// }

// components/BookedLesson/index.tsx
import Link from 'next/link'
import { useState } from 'react'
import { BookedLesson } from '@/interface'
import Modal from '../Modal'
import { cancelLessonBooking } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { useQueryClient } from 'react-query'

export const BookedLessonItem = ({ lesson }: { lesson: BookedLesson }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const queryClient = useQueryClient()

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '승인 대기'
      case 'CONFIRMED':
        return '승인 완료'
      case 'CANCELLED':
        return '취소됨'
      default:
        return status
    }
  }

  const handleCancel = async () => {
    try {
      setIsCancelling(true)
      await cancelLessonBooking(lesson.id)
      toast.success('레슨 예약이 취소되었습니다.')
      queryClient.invalidateQueries('lesson-bookings')
      setIsOpen(false)
    } catch (error) {
      toast.error('레슨 예약 취소에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-lg">{lesson.teacherName} 강사</h3>
            <span
              className={`${getStatusColor(lesson.status)} text-sm font-medium`}
            >
              {getStatusText(lesson.status)}
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

          {lesson.status !== 'CANCELLED' && (
            <button
              onClick={() => setIsOpen(true)}
              className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white rounded-md px-4 py-2"
            >
              예약 취소하기
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        title="레슨 예약 취소"
      >
        <div className="flex flex-col gap-2 mt-4">
          <h1 className="text-lg font-semibold">
            레슨 예약을 취소하시겠습니까?
          </h1>
          <p className="text-gray-600">
            예약을 취소하면 같은 시간대에 다시 예약하기 어려울 수 있습니다.
            정말로 취소하시겠습니까?
          </p>
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md px-5 py-2.5"
            >
              돌아가기
            </button>
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="flex-1 bg-rose-600 hover:bg-rose-500 text-white rounded-md px-5 py-2.5 disabled:bg-gray-300"
            >
              {isCancelling ? '취소 처리중...' : '예약 취소하기'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
