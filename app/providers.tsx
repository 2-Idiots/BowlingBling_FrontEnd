'use client'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

interface Props {
  children?: React.ReactNode
}

const queryClient = new QueryClient()

export const NextProvider = ({ children }: Props) => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </RecoilRoot>
  )
}

export const NextLayout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      {/* <div className="mt-5 p-5 min-h-[80vh]">{children}</div> */}
      {children}
      <Footer />
    </>
  )
}
