'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
    { label: 'Tailor', id: 'tailor' },
    { label: 'Store', id: 'store' },
    { label: 'Social', id: 'social' },
]

export default function HeaderNavTabs({
    onNavigate,
}: {
    onNavigate: (id: string) => void
}) {
    const [activeId, setActiveId] = useState('tailor')
    const [cursor, setCursor] = useState<{ left: number; width: number } | null>(null)


    const tabRefs = useRef<Record<string, HTMLLIElement | null>>({})

    /* -----------------------------
       ACTIVE TAB SYNC ON SCROLL
    ------------------------------ */
    useEffect(() => {
        const onScroll = () => {
            const hero = document.getElementById('hero')
            if (hero) {
                const heroRect = hero.getBoundingClientRect()

                // If hero is still in view → clear active tab
                if (heroRect.bottom > window.innerHeight * 0.5) {
  if (activeId !== '') {
    setActiveId('')
    setCursor(null)
  }
  return
}

            }

            for (const item of NAV_ITEMS) {
                const section = document.getElementById(item.id)
                if (!section) continue

                const rect = section.getBoundingClientRect()

                if (
                    rect.top <= window.innerHeight * 0.45 &&
                    rect.bottom >= window.innerHeight * 0.45
                ) {
                    setActive(item.id)
                    break
                }
            }
        }

        window.addEventListener('scroll', onScroll)
        onScroll()

        return () => window.removeEventListener('scroll', onScroll)
    }, [])


    const setActive = (id: string) => {
        const el = tabRefs.current[id]
        if (!el) return

        setActiveId(id)
        setCursor({
            left: el.offsetLeft,
            width: el.getBoundingClientRect().width,
        })
    }

    return (
        <ul
            className="
        relative flex items-center
        rounded-xl
        
        bg-transparent
        px-2 py-1
        lg:px-6
        gap-2 lg:gap-4
      "
        >
            {NAV_ITEMS.map((item) => (
                <li
  key={item.id}
  ref={(el) => {
    tabRefs.current[item.id] = el
  }}
  onClick={() => {
    setActive(item.id)
    onNavigate(item.id)
  }}
  className={`
    relative z-10 cursor-pointer select-none group
    px-6 py-2
    text-sm font-Poppins
    transition-colors
    ${activeId === item.id ? 'text-[#FCF4E1]' : 'text-[#046C4E]'}
  `}
>
  {item.label}

  {/* underline hover */}
{activeId !== item.id && (
  <span
    className="
      absolute left-0 -bottom-0.5 h-[2px]
      w-0 group-hover:w-full
      transition-all duration-300
      bg-[#046C4E]
    "
  />
)}
</li>
            ))}

            {/* ACTIVE BACKGROUND */}
            {cursor && (
                <motion.li
                    animate={cursor}
                    transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                    className="
      absolute inset-y-1
      rounded-xl
      bg-[#046C4E]
      z-0
    "
                />
            )}
        </ul>
    )
}
