'use client'

import { useAuth } from '@/app/context/AuthContext'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import clsx from 'clsx'

export default function Header() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);

  const isLoggedIn = !!user

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isLoggedIn
          ? 'bg-white shadow-sm backdrop-blur'
          : 'bg-transparent'
      )}
    >
      <div className="w-full flex items-center justify-between h-20 px-2 md:px-6 lg:px-10">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-1 ml-0">
            <img
              src="/dressmaker.png"
              alt="TailorPro Logo"
              className="h-14 w-14 object-contain"
            />
            <span className="font-bold text-lg text-black">
              Tailor<span className="text-emerald-500">Pro</span>
            </span>
          </div>

          {/* Navigation links — ONLY when logged OUT */}
          {!isLoggedIn && (
            <nav className="hidden md:flex gap-8 text-lg text-black">
              {['Customers', 'Blogs', 'Pricing'].map((link) => (
                <Link
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="relative group"
                >
                  {link}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center justify-end w-full max-w-xs">
          {!isLoggedIn ? (
            <Link
              href="/auth"
              className="
                flex text-lg items-center gap-3 
                px-6 py-3 
                bg-emerald-700 
                rounded-full 
                text-white 
                font-medium 
                transition-all duration-200 ease-out
                hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl shadow-emerald-700
              "
            >
              Join Now
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-black">
                <ChevronRight size={16} className="text-white" />
              </span>
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="  flex text-lg items-center gap-3 
                px-6 py-3 
                bg-emerald-700 
                rounded-full 
                text-white 
                font-medium 
                transition-all duration-200 ease-out
                hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl shadow-emerald-700"
              >
                {user.fullName}
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-200 ${
                    open ? 'rotate-90' : ''
                  }`}
                />
              </button>

              <div
                className={`absolute right-0 mt-2 w-40 bg-white rounded-md text-black shadow ${
                  open ? 'block' : 'hidden'
                }`}
              >
                <Link
                  href="/profile"
                  className="block px-6 py-4 hover:bg-gray-100 text-md font-medium"
                >
                  Profile
                </Link>

                <button
                  onClick={async () => {
                    await logout()
                    window.location.href = '/auth'
                  }}
                  className="block w-full text-left px-6 py-4 hover:bg-gray-100 text-md font-medium text-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
