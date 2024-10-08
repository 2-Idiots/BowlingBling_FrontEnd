'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { RiKakaoTalkFill } from 'react-icons/ri'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const router = useRouter()
  const { status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/')
    }
  }, [status, router])

  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    setIsLoading(true)
    try {
      const result = await signIn(provider, {
        callbackUrl: '/',
        redirect: false,
      })
      if (result?.error) {
        toast.error('로그인에 실패했습니다.')
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-xl mx-auto pt-10 pb-24">
      <div className="flex flex-col gap-6">
        <h1 className="text-lg font-semibold text-center">
          로그인 또는 회원가입
        </h1>
        <hr className="border-b-gray-300" />
        <div className="text-xl md:text-2xl font-semibold">
          Bowling-Bling에 오신 것을 환영합니다.
        </div>
      </div>
      <div className="text-sm text-gray-500 mt-2">
        SNS 계정을 이용해서 로그인 또는 회원가입을 해주세요.
      </div>
      <div className="flex flex-col gap-5 mt-16">
        <button
          type="button"
          onClick={() => handleSocialLogin('google')}
          className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold"
        >
          <FcGoogle className="absolute left-5 text-xl" />
          구글로 로그인하기
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('kakao')}
          className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold"
        >
          <RiKakaoTalkFill className="absolute left-5 text-yellow-950 text-xl my-auto inset-y-0" />
          카카오로 로그인하기
        </button>
      </div>
    </div>
  )
}
