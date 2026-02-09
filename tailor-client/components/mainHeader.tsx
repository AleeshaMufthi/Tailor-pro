'use client'

import HeaderNavTabs from './HeaderNavTabs'


import { useEffect, useState } from 'react'
import clsx from 'clsx'

export default function MainHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll listener to reset URL when back to top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 50 && window.location.hash !== '') {
        history.replaceState(null, '', '/')
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })

      // Trigger a small scroll event after scrolling
      setTimeout(() => {
        window.dispatchEvent(new Event('scroll'))
      }, 100)

      // Update URL hash
      history.replaceState(null, '', id === 'hero' ? '/' : `#${id}`)
    }
  }


  const scrollToSectionmax = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return

  const yOffset = window.innerHeight * 0.9 // 🔥 tune this
  const y =
    el.getBoundingClientRect().top +
    window.pageYOffset +
    yOffset

  window.scrollTo({
    top: y,
    behavior: 'smooth',
  })

  // update URL
  history.replaceState(null, '', id === 'hero' ? '/' : `#${id}`)
}

  return (
    <header
      className={clsx(
        'bg-[#FCF4E1]/80 backdrop-blur shadow-sm fixed top-0 left-0 w-full z-50 transition-all duration-300'
      )}
    >
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
        {/* Logo */}
        {/* <div className="flex items-center gap-2" onClick={() => scrollToSection('hero')} draggable='true'> <img src="/dressmaker.png" className="h-10 w-10" /> <span className="text-xl font-bold"> Tailor<span className="text-emerald-600">Pro</span> </span> </div> */}


<div
  className="flex items-center cursor-pointer"
  onClick={() => scrollToSection('hero')}
>
  <img
    src="images/Loomiz.png"
    className="h-auto w-[8rem] md:w-[9rem] lg:w-[10rem]"
    alt="TailorPro Logo"
  />
</div>



        {/* Nav */}
        <div className="hidden md:flex">
  <HeaderNavTabs onNavigate={scrollToSectionmax} />
</div>

        {/* CTA */}
        <button
          onClick={() => scrollToSectionmax('tailor')}
          className="px-6 py-2 rounded-xl bg-[#046C4E] text-[#FCF4E1] text-sm shadow-lg hover:bg-[#0B1C2D] transition font-Poppins"
        >
          Get Started
        </button>
      </div>
    </header>
  )
}
