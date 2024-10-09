import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
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
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          })

          if (!res.ok) {
            throw new Error('Failed to login')
          }

          const user = await res.json()
          console.log('Backend response:', user) // 백엔드 응답 로깅
          return { ...user, backendToken: JSON.stringify(user) }
        } catch (error) {
          console.error('Error during login:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.backendToken = user.backendToken
      }
      console.log('JWT callback:', token) // JWT 콜백 로깅
      return token
    },
    async session({ session, token }) {
      session.backendToken = token.backendToken
      console.log('Session callback:', session) // 세션 콜백 로깅
      return session
    },
  },
  pages: {
    signIn: '/users/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
