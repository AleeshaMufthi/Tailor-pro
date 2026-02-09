'use client'

import { color, Color, hover, motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollRevealText from './ScrollRevealText'
import SpotlightLinkButton from './SpotlightLinkButton'


gsap.registerPlugin(ScrollTrigger)

const reduceBlur = typeof window !== 'undefined' && window.innerWidth < 768

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768


interface ProductSectionProps {
  title: string
  subtitle: string
  images: string[]
  link: string
  reverse?: boolean
  id?: string
  parallaxImages?: ParallaxImage[]
  bg: string
  headingcolor:string
  paracolor:string
  buttoncolor:string
  hovercolor:string
  texthover: string
}
interface ParallaxImage {
  src: string
  className: string
  speed: number
  layer?: 'back' | 'front'
}


export default function ProductSection({
  title,
  subtitle,
  images,
  link,
  reverse = false,
  id,
  parallaxImages = []  ,
  bg,
  headingcolor,
  paracolor,
  buttoncolor,
  hovercolor,
  texthover
}: ProductSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Keep scroll-based animations only for the last two images
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const img2Y = useTransform(scrollYProgress, [0.3, 0.5], [80, 0])
  const img2Opacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1])
  const img3Y = useTransform(scrollYProgress, [0.55, 0.75], [100, 0])
  const img3Opacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1])


  const HEADING_START = 0.12
const HEADING_END = 0.32

const PARA_START = HEADING_END + 0.04 // small gap
const PARA_END = PARA_START + 0.18

const BUTTON_START = PARA_END + 0.04
const BUTTON_END = BUTTON_START + 0.18



  const parallaxRefs = useRef<HTMLDivElement[]>([])
parallaxRefs.current = []

const addParallaxRef = (el: HTMLDivElement | null) => {
  if (el && !parallaxRefs.current.includes(el)) {
    parallaxRefs.current.push(el)
  }
}

const textOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1])
const textY = useTransform(scrollYProgress, [0.15, 0.3], [20, 0])
const headingOpacity = useTransform(scrollYProgress, [0.12, 0.25], [0, 1])
const paraOpacity = useTransform(scrollYProgress, [0.5, 0.5], [0, 1])
const textBlur = reduceBlur
  ? 'blur(0px)'
  : useTransform(scrollYProgress, [0.15, 0.3], ['blur(12px)', 'blur(0px)'])



  const buttonOpacity = useTransform(scrollYProgress, [BUTTON_START, BUTTON_END], [0, 1])
const buttonY = useTransform(scrollYProgress, [BUTTON_START, BUTTON_END], [16, 0])

const buttonBlur = reduceBlur
  ? 'blur(0px)'
  : useTransform(
      scrollYProgress,
      [BUTTON_START, BUTTON_END],
      ['blur(10px)', 'blur(0px)']
    )

    const renderParallax = (img: ParallaxImage, i: number) => (
  <div
    key={i}
    ref={addParallaxRef}
    data-speed={img.speed}
    className={`absolute ${img.className}`}
  >
    <img src={img.src} />
  </div>
)



useEffect(() => {
  if (!containerRef.current) return

  const ctx = gsap.context(() => {
    parallaxRefs.current.forEach(el => {
      const element = el as HTMLElement
      const speed = Number(element.dataset.speed) || 0.3

      gsap.to(element, {
        yPercent: -speed * (isMobile ? 60 : 160),
        rotation: speed * (isMobile ? 6 : 20),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })
    })
  }, containerRef)

  return () => ctx.revert()
}, [])



  useEffect(() => {
    window.dispatchEvent(new Event('scroll')) // recalc Framer Motion on load
  }, [])

  return (
    
    <div ref={containerRef} className="relative h-[350vh]  " style={{ backgroundColor: bg }} id={id} >
      {/* STICKY - keep the sticky effect */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden perspective-[1200px]">
    <div className="absolute inset-0 z-0 pointer-events-none">
      {parallaxImages
        .filter(p => p.layer === 'back')
        .map(renderParallax)}
    </div>
        <div className="w-full px-6">
          <div
            className={`max-w-7xl  mx-auto 
 items-center ${reverse ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
          >
            {/* TEXT - NO animation */}
            <motion.div
  style={{
    opacity: textOpacity,
    y: textY,
    filter: textBlur,
  }}
  className="space-y-6 will-change-transform text-center flex flex-col items-center"
>
  <motion.h2 className="text-6xl md:text-8xl lg:text-8xl  leading-[1.05] font-PlayfairDisplay" style={{ opacity: headingOpacity , color:headingcolor}}>
  <ScrollRevealText
    text={title}
    scrollYProgress={scrollYProgress}
    start={HEADING_START}
    end={HEADING_END}
  />
  </motion.h2>

  <motion.p className="text-sm md:text-md lg:text-lg  max-w-md mx-auto font-Poppins" style={{ opacity: paraOpacity, color:paracolor }}>
  <ScrollRevealText
    text={subtitle}
    scrollYProgress={scrollYProgress}
    start={PARA_START}
    end={PARA_END}
  />
  </motion.p>

<motion.div
  style={{
    opacity: buttonOpacity,
    y: buttonY,
    filter: buttonBlur,
  }}
  className="inline-block mt-4 mx-auto mb-5 "
>
<motion.div
  style={{
    opacity: buttonOpacity,
    y: buttonY,
    filter: buttonBlur,
  }}
  className="inline-block mt-4 mx-auto mb-5 "
>
<SpotlightLinkButton
  href={link}
  buttonColor={buttoncolor}
  spotlightColor={hovercolor}
  textHoverColor={texthover}
  className="border-2"
>
  <ScrollRevealText
    text="Explore →"
    scrollYProgress={scrollYProgress}
    start={BUTTON_START}
    end={BUTTON_END}
    className='text-md font-Poppins '
  />
</SpotlightLinkButton>
</motion.div>

</motion.div>
</motion.div>


            {/* IMAGES */}
            {/* <div className="relative mx-auto w-[340px] md:w-[400px] lg:w-[600px] xl:w-[620px] aspect-[3/2]"> */}
              {/* First image - NO animation */}
              {/* <img
                src={images[0]}
                className="absolute inset-0 w-full h-full object-contain z-10 "
                draggable={false}
              /> */}
              {/* Second image - animated */}
              {/* <motion.img
                src={images[1]}
                style={{ y: img2Y, opacity: img2Opacity }}
                className="absolute inset-0 w-full h-full object-contain z-10 "
                draggable={false}
              /> */}
              {/* Third image - animated */}
              {/* <motion.img
                src={images[2]}
                style={{ y: img3Y, opacity: img3Opacity }}
                className="absolute inset-0 w-full h-full object-contain z-10"
                draggable={false}
              />
            </div> */}

            {/* PARALLAX LAYER */}
{parallaxImages?.map((img, i) => (
  <div
    key={i}
    ref={addParallaxRef}
    data-speed={img.speed}
    className={`absolute pointer-events-none z-30 ${img.className}`}
  >
    <img src={img.src} />
  </div>
))}
</div>
          
</div>
        
</div>
      
</div>
    
  )
}
