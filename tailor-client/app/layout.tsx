import './globals.css'
import { ReactNode } from 'react'
import { AuthProvider } from './context/AuthContext'
// import Header from '@/components/Header'

export const metadata = {
  title: 'Tailor Pro - Tailor Management',
  description: 'Manage customers, orders, calendar and invoices for tailor boutiques.',
}

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* <div className="min-h-screen bg-gray-50 text-gray-900"> */}
            
            {/* <Header /> */}

            {/* <main> */}
              {children}
              {/* </main> */}
            
          {/* </div> */}
        </AuthProvider>
      </body>
    </html>
  )
}
