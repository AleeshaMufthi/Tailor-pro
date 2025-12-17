"use client";

import Link from "next/link";
import Waves from "@/components/Waves";
import Image from "next/image" 

const HeroLine = ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="flex items-center justify-center gap-3">
    {icon && <span className="inline-flex items-center">{icon}</span>}
    <span>{children}</span>
  </div>
);

export default function Page() {
  const logos = [
    "/logos/burberry.png",
    "/logos/chanel.png",
    "/logos/dior.png",
    "/logos/fendi.png",
    "/logos/louis.png",
    "/logos/polo.png",
    "/logos/prada.png",
    "/logos/versace.png"
  ];

  const repeated = [...logos, ...logos, ...logos];

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <Waves
        lineColor="#D3D3D3"
        backgroundColor="rgba(255,255,255,0.06)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />

      {/* content above waves */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
<section className="flex-1 flex items-center justify-center px-6 pt-28 pb-16">
  <div className="relative w-full max-w-7xl mx-auto">

{/* LEFT SIDE TEXT */}
<div className="absolute -left-5 top-24 hidden lg:flex flex-col items-start text-gray-800 font-medium text-xl">

  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    fill="currentColor"
    viewBox="0 0 16 16"
    className="mb-4 text-emerald-600"
  >
    <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1"/>
  </svg>

  {/* Rotating list */}
  <div className="relative overflow-hidden h-[128px]">

     <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10" />
    
    <div className="animate-listRotate space-y-2">
      <span className="block">Clothing</span>
      <span className="block">Embroidery</span>
      <span className="block">Tailoring</span>
      <span className="block">Bespoke Services</span>

      {/* duplicate for smooth loop */}
      <span className="block">Clothing</span>
      <span className="block">Embroidery</span>
      <span className="block">Tailoring</span>
      <span className="block">Bespoke Services</span>
    </div>
  </div>
</div>

<style>{`
@keyframes listRotate {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
}
.animate-listRotate {
  animation: listRotate 10s linear infinite;
}
`}</style>


    {/* RIGHT SIDE TEXT */}
    <div className="absolute right-0 top-12 hidden lg:block max-w-xs text-md text-gray-700">
      <span className="font-semibold text-emerald-600">
      Trusted by 360+ fashion boutique owners
      </span>
      <span className="font-semibold">
        {" "}- from independent tailors and designer studios to modern fashion houses.
      </span>
    </div>

    {/* CENTER CONTENT */}
    <div className="text-center max-w-4xl mx-auto">
<h1 className="text-5xl md:text-7xl font-bold leading-tight text-black space-y-6">
  <div className="-translate-x-24">
    Master Your Craft, and
  </div>

  <div>
    Simplify
  </div>

  <div className="translate-x-24">
    <span className="text-emerald-600">Your Store</span> with Tilor
    <span className="text-emerald-600">Pro</span>
  </div>
</h1>


      {/* CTA */}
      <div className="mt-10">
        <Link
          href="/auth"
          className="inline-flex items-center gap-3 bg-black text-white rounded-full px-8 py-3 text-lg font-medium hover:bg-gray-900 transition"
        >
          Join Us Now
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-emerald-600">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
        </Link>
      </div>
    </div>
  </div>
 <svg 
 xmlns="http://www.w3.org/2000/svg" 
 width="36" 
 height="36" 
 fill="currentColor" 
 viewBox="0 0 16 16" 
 className="mb-5 mr-20 text-emerald-700">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
  </svg>
</section>


        <section className="w-full bg-transparent py-8">
          <div className="relative overflow-hidden">
            <div
              className="flex items-center gap-8 will-change-transform"
              style={{
                animation: "marquee 24s linear infinite",
              }}
            >
              {repeated.map((src, idx) => (
                <div key={`${src}-${idx}`} className="flex-shrink-0">
                  <img src={src} alt={`partner-${idx}`} className="h-12 md:h-16 object-contain" />
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* THIRD SECTION */}
<section className="relative z-10 px-6 py-16">
  <div className="max-w-8xl mx-auto">

    {/* TOP CARD GRID */}
    <div className="bg-gray-50 rounded-[40px] p-12 md:p-30">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Column 1 */}
        <div className="flex flex-col gap-6">
         <div className="bg-gray-200 rounded-2xl h-60 relative overflow-hidden">
        <img
    src="/landing/image2.png"
    alt="Customer History"
    className="h-full w-full object-cover"
  />
</div>


          <div className="bg-gray-200 rounded-2xl p-5 text-lg font-semibold">
            Store customer measurements, preferences, and order history in one secure place, always ready when you need them.
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-6">
          <div className="bg-gray-200 rounded-2xl p-5 text-lg font-semibold">
            Designed to help tailors and fashion boutiques work faster, stay organized, and deliver a premium experience every time.
          </div>

          <div className="bg-gray-200 rounded-2xl h-56 relative overflow-hidden">
  <img
    src="/landing/image5.png"
    alt="All in one tailoring app"
    className="h-full w-full object-cover"
  />
</div>

        </div>

        {/* Column 3 */}
        <div className="bg-gray-200 rounded-2xl min-h-[280px] relative overflow-hidden">
  <img
    src="/landing/image4.png"
    alt="Tailoring management dashboard"
    className="h-full w-full object-cover"
  />
</div>

        {/* Column 4 */}
        <div className="flex flex-col gap-6">
<div className="bg-gray-200 rounded-2xl h-60 relative overflow-hidden">
  <img
    src="/landing/image6.png"
    alt="Seamless tailoring experience"
    className="h-full w-full object-cover"
  />
</div>

          <div className="bg-gray-200 rounded-2xl p-5 text-lg font-semibold">
            Seamless order creation, instant updates, and clear tracking - so your customers leave saying,
            “Whoa, that was smooth.”
          </div>
        </div>
      </div>
    </div>

    {/* MIDDLE BAR */}
    <div className="mt-5 bg-gray-50 rounded-full px-6 py-6 flex items-center justify-between">
      <span className="bg-emerald-600 text-white px-8 py-4 rounded-full text-md font-medium">
        Why Us 
      </span>

      <span className="text-xl font-medium text-gray-800 hover:underline cursor-pointer">
        Trusted on Communities →
      </span>

      <span className="bg-emerald-600 text-white px-8 py-4 rounded-full text-md font-medium">
        Our Features
      </span>
    </div>

    {/* BOTTOM CONTENT */}
    {/* <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-12 items-start bg-gray-50 rounded-[40px] p-12 md:p-30">

      <div>
        <h3 className="text-2xl font-semibold mb-6 items-center justify-center">
          Get Started with <br />
          Your Favourite Features
        </h3>

        <div className="flex flex-wrap gap-4">
          <span className="feature-pill">Flexible Registration</span>
          <span className="feature-pill">Simplified order creation</span>
          <span className="feature-pill">Track Daily Revenue</span>
          <span className="feature-pill">Get Instant reminders on Whatsapp</span>
          <span className="feature-pill">Automated communication</span>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-700 mb-4">
          Live dashboards – for check-ins, drop-offs,
          <br />
          Know your customer pulse in realtime
        </p>

        <div className="bg-gray-200 rounded-3xl h-64 flex items-center justify-center">
          Image
        </div>
      </div>
    </div> */}
  </div>
</section>



{/* <section className="py-20 px-6 bg-gray-50">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div>
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Designed for modern tailors
      </h2>
      <p className="text-gray-600 mb-6">
        TailorPro combines clean design with powerful tools to simplify
        your daily workflow — from order creation to final delivery.
      </p>
      <ul className="space-y-3 text-gray-700">
        <li>✔ Clean & intuitive dashboard</li>
        <li>✔ Mobile-friendly design</li>
        <li>✔ Fast & secure access</li>
      </ul>
    </div>

  
    <div className="relative">
  <div className="w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg">
    <Image
      src="/mainimage.png"
      alt="TailorPro dashboard"
      fill
      className="object-cover"
      priority
    />
  </div>
</div>
  </div>
</section> */}


      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); } /* adjust depending on repeats */
        }

        /* Improve marquee responsiveness: slow on mobile */
        @media (max-width: 640px) {
          div[style*="animation: marquee"] {
            animation-duration: 40s !important;
          }
        }
      `}</style>
    </div>
  );
}
