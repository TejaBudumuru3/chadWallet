'use client'
import { useState, useEffect, useRef } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { TokenBanner } from '@/components/landing/TokenBanner'
import { APP_LINKS } from '@/lib/constants'

// Core horizontal workflows provided by founder
const APP_FLOWS = [
  {
    id: 'memecoin',
    title: 'Discover Memecoins',
    desc: 'Scan the market for the hottest tokens. View live price feeds, changes, and volume data.',
    image: '/flow/memecoin-4.png',
  },
  {
    id: 'buy-sell',
    title: 'Instantly Buy & Sell',
    desc: 'One-click swaps with customized slippage and gas settings. Never miss a pump.',
    image: '/flow/buy-sell-4.png',
  },
  {
    id: 'kol',
    title: 'KOL Copy Trading',
    desc: 'Follow top-performing wallets automatically. Copy the plays of professional traders.',
    image: '/flow/kol-4.png',
  },
  {
    id: 'launch',
    title: 'Launch Tokens',
    desc: 'Deploy new pools directly from the app. Seamless custom launches on Solana.',
    image: '/flow/launch-4.png',
  },
  {
    id: 'portfolio',
    title: 'Track Portfolio',
    desc: 'Monitor your profits and losses in real-time. Full history of all your swaps.',
    image: '/flow/portfolio-4.png',
  },
  {
    id: 'relaunch',
    title: 'Relaunch & Upgrade',
    desc: 'Continuous updates, security audits, and new features shipped weekly.',
    image: '/flow/relaunch-4.png',
  },
]

// Vertical app screenshots for the phone frames
const APP_SCREENS = [
  {
    id: 'splash',
    label: 'Onboarding',
    title: 'Secure Privy Login',
    desc: 'Connect with Google or Apple. Privy automatically generates a secure Solana embedded wallet for you.',
    image: '/app store/splash.png',
  },
  {
    id: 'discover',
    label: 'Feed',
    title: 'Trending Memecoins',
    desc: 'Browse a real-time feed of trending tokens. Filter by price changes, volume, and creation time.',
    image: '/app store/discover.png',
  },
  {
    id: 'search',
    label: 'Search',
    title: 'Instant Lookup',
    desc: 'Search any token by symbol, name, or contract address. Instantly load trading data.',
    image: '/app store/search.png',
  },
  {
    id: 'deposit',
    label: 'Wallet',
    title: 'Deposit Funds',
    desc: 'Easily deposit SOL or USDC to fund your embedded wallet and start trading.',
    image: '/app store/deposit.png',
  },
  {
    id: 'token',
    label: 'Charts',
    title: 'Deep Analytics',
    desc: 'High-performance candlestick charts, transaction feeds, and pool health overview.',
    image: '/app store/token.png',
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    title: 'Live Tracking',
    desc: 'Track your holdings, average entries, profit/loss (PnL), and transaction history.',
    image: '/app store/portfolio.png',
  },
  {
    id: 'kol',
    label: 'Copy Trade',
    title: 'KOL Copy Trading',
    desc: 'Subscribe to top-performing wallets and copy their trades automatically.',
    image: '/app store/kol.png',
  },
  {
    id: 'launch',
    label: 'Launchpad',
    title: 'Deploy Pools',
    desc: 'Deploy custom tokens and launch liquidity pools on Solana directly from mobile.',
    image: '/app store/launch.png',
  },
  {
    id: 'x',
    label: 'Social',
    title: 'X Feed Integration',
    desc: 'See what Twitter is saying about your tokens with direct social feeds.',
    image: '/app store/x.png',
  },
]

export default function Home() {
  const [activeFlowIdx, setActiveFlowIdx] = useState(0)
  const [activeScreenIdx, setActiveScreenIdx] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Auto rotate app screenshots every 5 seconds (pause on hover)
  const [isHovered, setIsHovered] = useState(false)

  // Autoplay handler to ensure muted video plays correctly on all platforms
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.play().catch((err) => {
        console.warn('Autoplay failed or interrupted:', err)
      })
    }
  }, [])

  useEffect(() => {
    if (isHovered) return
    const interval = setInterval(() => {
      setActiveScreenIdx((prev) => (prev + 1) % APP_SCREENS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isHovered])

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* Top Token Banner */}
      <TokenBanner />

      {/* Sticky Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Copy */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5F236]/10 border border-[#C5F236]/20">
            <span className="w-2 h-2 rounded-full bg-[#C5F236] animate-pulse" />
            <span className="text-sm font-semibold text-[#C5F236] tracking-wide uppercase">
              Now Live on Solana Mainnet
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05]">
            HUNT EVERY <br className="hidden sm:inline" />
            <span className="text-[#C5F236]">MEMECOIN.</span>
            <br />
            EVERY CHAIN. <br className="hidden sm:inline" />
            <span className="text-white/40">ONE WALLET.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            The fastest mobile trading wallet built for the Solana ecosystem.
            Instantly track wallets, copy trades, auto-buy on launch, and unlock
            high-speed swaps.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a
              href={APP_LINKS.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3.5 bg-white text-black font-bold rounded-2xl hover:bg-[#C5F236] hover:text-black transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-white/5"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>Download on App Store</span>
            </a>
            <a
              href={APP_LINKS.playStore}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3.5 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35m13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27m3.35-4.31c.34.27.56.69.56 1.19s-.22.92-.56 1.19l-2.29 1.32-2.5-2.5 2.5-2.5 2.29 1.3M6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z"/>
              </svg>
              <span>Get it on Google Play</span>
            </a>
          </div>
        </div>

        {/* Right Column: Sleek Phone Video Container */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-[300px] sm:w-[320px] aspect-[9/19.5] rounded-[50px] border-[8px] border-zinc-800 bg-zinc-950 overflow-hidden shadow-[0_0_50px_rgba(197,242,54,0.15)] ring-1 ring-zinc-700/50">
            {/* Phone Notch/Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-20" />
            
            {/* Real App Video */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
              preload="auto"
              autoPlay
            >
              <source src="/video/chadwallet.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* Interactive App Screenshots Slider (Blends perfectly with phoneframe + tabs) */}
      <section className="bg-zinc-950/20 border-y border-white/5 py-24 px-6" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              THE CHAD<span className="text-[#C5F236]">WALLET</span> EXPERIENCE
            </h2>
            <p className="text-white/50 text-sm md:text-base">
              Take a look at the interfaces designed for maximum speed and visual clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side: Interactive Screen Info Tabs */}
            <div className="lg:col-span-6 grid grid-cols-3 gap-2">
              {APP_SCREENS.map((screen, idx) => (
                <button
                  key={screen.id}
                  onClick={() => setActiveScreenIdx(idx)}
                  className={`p-3 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                    activeScreenIdx === idx
                      ? 'bg-[#C5F236]/15 border-[#C5F236]/40 shadow-lg shadow-[#C5F236]/5'
                      : 'bg-transparent border-white/5 hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`block text-xs font-black transition-colors ${
                      activeScreenIdx === idx ? 'text-[#C5F236]' : 'text-white/60'
                    }`}
                  >
                    {screen.label}
                  </span>
                </button>
              ))}

              {/* Active Screen details card below the grid selectors */}
              <div className="col-span-3 mt-6 p-6 rounded-2xl bg-white/2 border border-white/5 min-h-[140px] flex flex-col justify-center">
                <h3 className="text-lg font-bold text-[#C5F236] mb-2 transition-all duration-300">
                  {APP_SCREENS[activeScreenIdx].title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed transition-all duration-300">
                  {APP_SCREENS[activeScreenIdx].desc}
                </p>
              </div>
            </div>

            {/* Right side: Sleek floating Phone mockup displaying the active screenshot */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-[280px] aspect-[9/19.5] rounded-[44px] border-[6px] border-zinc-800 bg-zinc-950 overflow-hidden shadow-[0_0_50px_rgba(197,242,54,0.1)] ring-1 ring-zinc-700/50 transition-all duration-500 scale-95 hover:scale-100">
                {/* Island notch */}
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20" />
                
                {/* Active Screenshot */}
                <img
                  key={APP_SCREENS[activeScreenIdx].id}
                  src={APP_SCREENS[activeScreenIdx].image}
                  alt={APP_SCREENS[activeScreenIdx].title}
                  className="w-full h-full object-cover animate-fadeIn"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive App Flows / Walkthrough */}
      <section className="bg-black py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              PRO TRADING <span className="text-[#C5F236]">FLOWS</span>
            </h2>
            <p className="text-white/50 text-sm md:text-base">
              Explore how ChadWallet optimizes your workflow. Click through the key steps below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Steps Selectors */}
            <div className="lg:col-span-5 space-y-3">
              {APP_FLOWS.map((flow, index) => (
                <button
                  key={flow.id}
                  onClick={() => setActiveFlowIdx(index)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    activeFlowIdx === index
                      ? 'bg-[#C5F236]/10 border-[#C5F236]/30 shadow-lg shadow-[#C5F236]/5'
                      : 'bg-transparent border-white/5 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                        activeFlowIdx === index
                          ? 'bg-[#C5F236] text-black'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <h3
                      className={`font-bold text-base transition-colors ${
                        activeFlowIdx === index ? 'text-[#C5F236]' : 'text-white'
                      }`}
                    >
                      {flow.title}
                    </h3>
                  </div>
                  {activeFlowIdx === index && (
                    <p className="text-xs text-white/50 mt-3 pl-9 leading-relaxed animate-fadeIn">
                      {flow.desc}
                    </p>
                  )}
                </button>
              ))}
            </div>

            {/* Step Image Display */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative glass rounded-3xl p-4 md:p-6 w-full max-w-[550px] aspect-[4/3] flex items-center justify-center overflow-hidden shadow-2xl border-white/10">
                <img
                  key={APP_FLOWS[activeFlowIdx].id}
                  src={APP_FLOWS[activeFlowIdx].image}
                  alt={APP_FLOWS[activeFlowIdx].title}
                  className="max-w-full max-h-full object-contain rounded-xl transition-all duration-500 scale-95 hover:scale-100"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Value Props */}
      <section className="px-6 py-24 border-t border-white/5 bg-zinc-950/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Instant Execution',
              desc: 'Powered by private RPC routing nodes. Swap memecoins in milliseconds without transaction drops.',
              icon: '⚡',
            },
            {
              title: 'Copy trading',
              desc: 'Subscribe to high-hit-rate wallets and execute identical transactions automatically as soon as they hit the chain.',
              icon: '👥',
            },
            {
              title: '$CHAD Loyalty Rewards',
              desc: 'Trade to earn points and claim $CHAD loyalty bonuses. Boost your returns with copy trade shares.',
              icon: '💎',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="glass rounded-3xl p-8 hover:border-[#C5F236]/30 transition-all duration-300 group"
            >
              <div className="text-4xl mb-6">{f.icon}</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-[#C5F236] transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="bg-[#C5F236] text-black py-16 text-center px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
            START HUNTING TODAY
          </h2>
          <p className="font-semibold text-sm md:text-base opacity-70">
            Available on iOS and Android. Join thousands of high-speed traders.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <a
              href={APP_LINKS.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-zinc-900 transition-colors"
            >
              App Store
            </a>
            <a
              href={APP_LINKS.playStore}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-black/10 text-black border border-black/20 font-bold rounded-xl hover:bg-black/20 transition-colors"
            >
              Google Play
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo/light.png" alt="ChadWallet Logo" className="h-6 w-auto" />
            <span className="font-black text-white tracking-wider text-sm">
              CHAD<span className="text-[#C5F236]">WALLET</span>
            </span>
          </div>
          <span className="text-xs text-white/30">
            © 2025 Chad Wallet L.L.C. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <a
              href={APP_LINKS.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              chadwallet.xyz
            </a>
          </div>
        </div>
      </footer>

      {/* Bottom Token Banner */}
      <TokenBanner />
    </div>
  )
}
