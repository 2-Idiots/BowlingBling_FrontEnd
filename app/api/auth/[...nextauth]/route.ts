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
          // 먼저 로그인 요청
          const loginRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          )

          if (!loginRes.ok) {
            throw new Error('Login failed')
          }

          const loginData = await loginRes.json()

          // 로그인 성공 후 사용자 정보 요청
          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/info`,
            {
              headers: {
                Authorization: `Bearer ${loginData.accessToken}`,
              },
            },
          )

          if (!userRes.ok) {
            throw new Error('Failed to fetch user info')
          }

          const userData = await userRes.json()

          return {
            id: userData.id || credentials.email,
            email: credentials.email,
            name: userData.nickname, // nickname을 name으로 사용
            image: userData.image || null,
            accessToken: loginData.accessToken,
            refreshToken: loginData.refreshToken,
          }
        } catch (error) {
          console.error('Error:', error)
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        email: token.email,
        name: token.name,
        image: token.image,
      }
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken

      console.log('Session in callback:', session)
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
