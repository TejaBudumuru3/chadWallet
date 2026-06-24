'use client'

import { ChartCandlestickIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export function FlowDesign1({ flows }: { flows: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null)

  // Track active item based on scroll position (Desktop)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const width = container.clientWidth
      const index = Math.round((scrollLeft + 10) / width)
      setActiveIndex(index)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Track active item based on scroll position (Mobile)
  useEffect(() => {
    const container = mobileScrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      // Mobile items are typically ~85vw wide plus gap
      const childWidth = container.firstElementChild?.clientWidth || container.clientWidth
      const index = Math.round((scrollLeft + 10) / childWidth)
      setActiveIndex(Math.min(index, flows.length - 1))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [flows.length])

  // Automatic Slideshow Logic
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % flows.length

        // Scroll desktop container
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            left: scrollContainerRef.current.clientWidth * nextIndex,
            behavior: 'smooth'
          })
        }

        return nextIndex
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [isPaused, flows.length])

  return (
    <div
      className="w-full bg-[#09090b] text-white py-24 border-y border-white/5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Desktop Layout */}
        <div className="hidden md:flex h-[600px] gap-8">
          {/* 25% Left Track */}
          <div className="w-1/4 flex flex-col justify-center gap-6 py-8">
            {flows.map((flow, i) => (
              <div
                key={flow.id}
                className={`flex flex-col gap-1 transition-all duration-300 ${i === activeIndex ? 'opacity-100 scale-105 origin-left' : 'opacity-30 cursor-pointer hover:opacity-60'}`}
                onClick={() => {
                  setActiveIndex(i)
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                      left: scrollContainerRef.current.clientWidth * i,
                      behavior: 'smooth'
                    })
                  }
                }}
              >
                <span className="text-[#C5F236] text-sm font-bold">0{i + 1}</span>
                <span className="font-bold text-xl">{flow.title}</span>
              </div>
            ))}
          </div>

          {/* 75% Right Viewport */}
          <div className="w-3/4 bg-[#121212] rounded-[32px] border border-white/10 overflow-hidden relative shadow-2xl">
            <div
              ref={scrollContainerRef}
              className="w-full h-full flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={() => setIsPaused(true)} // Pause on manual scroll
            >
              {flows.map((flow) => (
                <div key={flow.id} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-8 lg:p-12 relative">
                  {/* Background glow behind image */}
                  <div className="absolute inset-0 bg-[#C5F236]/5 blur-[100px] z-0 pointer-events-none" />

                  <div className="relative w-full h-full bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex flex-col items-center justify-center shadow-2xl z-10">
                    <img src={flow.image} alt={flow.title} className="w-auto h-full max-h-[400px] object-contain" />

                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent z-20 translate-y-4 opacity-0 transition-all duration-500" style={{ opacity: isPaused ? 1 : 0, transform: isPaused ? 'translateY(0)' : 'translateY(1rem)' }}>
                      <h3 className="text-2xl font-bold">{flow.title}</h3>
                      <p className="text-gray-300 mt-2 max-w-lg">{flow.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-6 pb-12">
          <div className="w-full">
            <div className="bg-[#121212] rounded-[32px] border border-white/10 overflow-hidden relative shadow-2xl">
              {/* Image Viewport Container */}
              <div className="relative w-full aspect-[4/3] bg-black overflow-hidden p-4">
                <div
                  className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                  {flows.map((flow) => (
                    <div key={flow.id} className="w-full h-full flex-shrink-0 flex items-center justify-center relative p-8">
                      <div className="absolute inset-0 bg-[#C5F236]/10 blur-[50px] z-0 pointer-events-none" />
                      <img src={flow.image} alt={flow.title} className="w-full h-full object-contain relative z-10 scale-[1.3]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Tracker */}
              <div className="p-6 border-t border-white/5 bg-black/40">
                <div className="flex flex-col gap-3">
                  {flows.map((flow, i) => (
                    <button
                      key={flow.id}
                      onClick={() => setActiveIndex(i)}
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 text-left ${activeIndex === i ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5 opacity-60'
                        }`}
                    >
                      <span className={`text-sm font-black ${activeIndex === i ? 'text-accent' : 'text-zinc-500'}`}>0{i + 1}</span>
                      <span className="text-sm font-bold truncate">{flow.title}</span>
                    </button>
                  ))}
                </div>

                {/* Mobile Direct Trade Access CTA */}
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                  <Link
                    href="/trade"
                    className="w-full py-4 px-6 bg-foreground text-black font-black text-center rounded-2xl hover:bg-[#C5F236]/90 transition-colors shadow-[0_0_20px_rgba(197,242,54,0.2)] flex items-center justify-center gap-2"
                  >
                    <ChartCandlestickIcon />
                    LAUNCH TRADING TERMINAL
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
