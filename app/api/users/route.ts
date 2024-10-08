import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized user' },
      {
        status: 401,
      },
    )
  }

  console.log('Access Token from session:', session.user.accessToken)
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data, {
      status: 200,
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      {
        status: 500,
      },
    )
  }
}
