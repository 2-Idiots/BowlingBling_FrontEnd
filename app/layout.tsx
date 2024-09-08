import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NextLayout } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bowling Bling',
  description: 'Bowling Bling으로 볼링을 보다 더 전문적으로.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextLayout>{children}</NextLayout>
      </body>
    </html>
  )
}
