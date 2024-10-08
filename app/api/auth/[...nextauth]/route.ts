import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'
import { UserType } from '@/interface' // UserType을 import

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
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          })

          if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.message || 'Failed to sign in')
          }

          const user = await res.json()
          return user
        } catch (error) {
          console.error('Error during sign in:', error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email', // 필요한 권한
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'profile_nickname, profile_image', // 필요한 권한
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.properties.nickname,
          image: profile.properties.profile_image,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = (user as UserType).role
        console.log('JWT Token after login:', token)
      }

      if (account) {
        if (account.provider === 'google') {
          token.accessToken = account.access_token // google Access Token 저장
        }
        if (account.provider === 'kakao') {
          token.accessToken = account.access_token // kakao Access Token 저장
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.role = token.role as string
        session.user.accessToken = token.accessToken // 세션에 액세스 토큰 저장

        console.log('Session after login:', session)
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
