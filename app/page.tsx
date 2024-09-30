import Notice from '@/components/Notice'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Notice />

      <h2 className="text-xl font-semibold mb-4">
        회원님을 위한 선생님을 보고싶다면?
      </h2>

      <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl mr-2">🔥</span>
          <span>본인 구질에 맞는 선생님을 만나보세요!</span>
        </div>
        <Link href="/lesson" className="text-gray-500">
          레슨 둘러보기
        </Link>
      </div>
    </div>
  )
}
