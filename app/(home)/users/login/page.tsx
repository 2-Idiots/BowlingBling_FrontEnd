'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, signIn, useSession } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { RiKakaoTalkFill } from 'react-icons/ri'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/')
    }
  }, [status, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        toast.error('로그인에 실패했습니다.')
      } else {
        toast.success('로그인 성공!')
        console.log('Login successful, checking session...')

        // 즉시 세션 확인
        const immediateSession = await getSession()
        console.log('Immediate session:', immediateSession)

        // 1초 후 세션 다시 확인
        setTimeout(async () => {
          const delayedSession = await getSession()
          console.log('Delayed session (1s):', delayedSession)
        }, 1000)

        // 3초 후 세션 다시 확인
        setTimeout(async () => {
          const laterSession = await getSession()
          console.log('Later session (3s):', laterSession)
        }, 3000)

        router.push('/')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto pt-10 pb-24">
      <div className="flex flex-col gap-6">
        <h1 className="text-lg font-semibold text-center">로그인</h1>
        <hr className="border-b-gray-300" />
        <div className="text-xl md:text-2xl font-semibold">
          Bowling-Bling에 오신 것을 환영합니다.
        </div>
      </div>
      <form onSubmit={handleLogin} className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            로그인
          </button>
        </div>
      </form>
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FcGoogle className="w-5 h-5" />
            <span className="ml-2">Google</span>
          </button>
          <button
            onClick={() => handleSocialLogin('kakao')}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <RiKakaoTalkFill className="w-5 h-5 text-yellow-500" />
            <span className="ml-2">Kakao</span>
          </button>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-gray-600">
        계정이 없으신가요?{' '}
        <a
          href="/users/sign-up"
          className="font-medium text-rose-600 hover:text-rose-500"
        >
          회원가입
        </a>
      </p>
    </div>
  )
}
