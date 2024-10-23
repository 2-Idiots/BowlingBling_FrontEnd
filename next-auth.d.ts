import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      email: string | null
      name: string | null
      image: string | null
    }
    accessToken: string
    refreshToken: string
  }

  interface User {
    id: string
    email: string
    name: string
    image: string | null
    accessToken: string
    refreshToken: string
  }
}
