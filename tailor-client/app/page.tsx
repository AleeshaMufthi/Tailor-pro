"use client";

import Link from "next/link";
import Waves from "@/components/Waves"; 

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
    <div className="relative min-h-screen overflow-hidden">
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
        {/* HERO */}
        <section className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="max-w-3xl text-center">
            <div className="text-3xl md:text-5xl font-extrabold leading-tight text-black">
              <div className="mb-2">
                <HeroLine
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1"/>
                    </svg>
                  }
                >
                  MASTER YOUR 
                </HeroLine>
              </div>

              <div className="mb-2 text-emerald-700">CRAFT,</div>

              <div className="mb-2">SIMPLIFY YOUR</div>

              <div className="mb-6">
                <HeroLine
                  icon={
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
                  </svg>
                  }
                >
                  STORE
                </HeroLine>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Link
                href="/auth"
                className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full px-8 py-3 text-lg transition transform hover:-translate-y-1"
              >
                Join Now
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-black">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
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
