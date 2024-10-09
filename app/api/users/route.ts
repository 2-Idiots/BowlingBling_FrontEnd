import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const accessToken = req.headers.get('Authorization')?.split('Bearer ')[1]

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized user' }, { status: 401 })
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/info`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 },
    )
  }
}
