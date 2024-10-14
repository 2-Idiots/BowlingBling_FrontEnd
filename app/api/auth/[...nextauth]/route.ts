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
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!res.ok) {
            const errorData = await res.text()
            console.error(
              'Login failed. Status:',
              res.status,
              'Error:',
              errorData,
            )
            throw new Error(`Login failed: ${res.status} ${res.statusText}`)
          }

          const user = await res.json()
          console.log('Backend response:', user)

          if (!user || !user.accessToken) {
            console.error('Invalid user data received:', user)
            throw new Error('Invalid user data received from server')
          }

          return {
            id: user.id || credentials.email,
            email: credentials.email,
            name: user.name || 'User',
            image: user.image || null,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
          }
        } catch (error) {
          console.error('Error during login:', error)
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
      console.log('Session callback:', session)
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
