import NextAuth from 'next-auth'
import { UserType } from '@/interface' // UserType을 import

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: UserType['role']
    }
  }

  interface User extends UserType {}
}
