import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt' as const,
    maxAge: 60 * 60 * 24, // 24 hours
    updateAge: 60 * 60 * 2, // 2 hours
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/sign-up`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(credentials),
            },
          )

          const user = await res.json()

          if (res.ok && user) {
            return user
          }
          return null
        } catch (error) {
          console.error('Error during sign up:', error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = user.role
      }
      if (
        account &&
        (account.provider === 'google' || account.provider === 'kakao')
      ) {
        // 소셜 로그인의 경우, 백엔드에 추가 요청을 보내 사용자 정보를 저장하거나 가져올 수 있습니다.
        // 이 부분은 백엔드 API에 맞게 구현해야 합니다.
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
