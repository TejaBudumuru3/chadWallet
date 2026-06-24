'use client'
import { useEffect, useRef, useState } from 'react'
import { APP_LINKS } from '@/lib/constants'
import { FlowDesign1 } from './FlowDesign1'


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

export function HomeClient() {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Interactive UI states for mobile carousel (Theme 3) and desktop Bento box (Theme 4)
  const [theme3Rotation, setTheme3Rotation] = useState(0)
  const theme3Dragging = useRef(false)
  const theme3StartX = useRef(0)
  const theme3StartRotation = useRef(0)

  const handleTheme3Start = (e: React.MouseEvent | React.TouchEvent) => {
    theme3Dragging.current = true
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    theme3StartX.current = clientX
    theme3StartRotation.current = theme3Rotation
  }

  const handleTheme3Move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!theme3Dragging.current) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const deltaX = clientX - theme3StartX.current
    const sensitivity = 0.5
    setTheme3Rotation(theme3StartRotation.current + deltaX * sensitivity)
  }

  const handleTheme3End = () => {
    theme3Dragging.current = false
    const snapped = Math.round(theme3Rotation / 40) * 40
    setTheme3Rotation(snapped)
  }

  const [theme4HoveredIdx, setTheme4HoveredIdx] = useState<number | null>(null)

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

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Copy */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <div className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-semibold text-accent tracking-wide uppercase">
              Now Live on Solana Mainnet
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05]">
            HUNT EVERY <br className="hidden sm:inline" />
            <span className="text-accent">MEMECOIN.</span>
            <br />
            EVERY CHAIN. <br className="hidden sm:inline" />
            <span className="text-secondary">ONE WALLET.</span>
          </h1>

          <p className="text-lg md:text-xl text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
            The fastest mobile trading wallet built for the Solana ecosystem.
            Instantly track wallets, copy trades, auto-buy on launch, and unlock
            high-speed swaps.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a
              href={APP_LINKS.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3.5 bg-foreground text-background font-bold rounded-2xl hover:bg-accent hover:text-background transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-foreground/5"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <span>Download on App Store</span>
            </a>
            <a
              href={APP_LINKS.playStore}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3.5 bg-card text-foreground font-bold rounded-2xl border border-border hover:brightness-110 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35m13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27m3.35-4.31c.34.27.56.69.56 1.19s-.22.92-.56 1.19l-2.29 1.32-2.5-2.5 2.5-2.5 2.29 1.3M6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
              </svg>
              <span>Get it on Google Play</span>
            </a>
          </div>
        </div>

        {/* Right Column: Sleek Phone Video Container */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-[230px] sm:w-[250px] md:w-[270px] aspect-[9/19] rounded-[38px] border-[6px] border-border bg-background overflow-hidden ring-1 ring-border shadow-2xl">
            {/* Phone Notch/Island */}

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

      {/* Text Marquee Strip */}


      {/* Section Header */}
      <section className="bg-background px-6 pt-24 pb-8">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <span className="text-sm font-semibold text-accent tracking-widest uppercase">The Alpha Terminal</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            For Meme Coins &amp;<br />
            Smart Wallet Tracking
          </h2>
          <p className="text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            ChadWallet isn&apos;t just another trading tool — it&apos;s your edge in the meme coin casino. We track the smartest wallets on Solana and tell you what they&apos;re buying before it moons.
          </p>
        </div>
      </section>

      {/* Core Flow Section (Theme 1: Immersive Theater) */}
      <FlowDesign1 flows={APP_FLOWS} />

      {/* Responsive App Screens Showcase Section */}
      <section className="py-24 bg-background border-t border-border relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-16 text-center">
          <span className="text-accent text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            Interface Tour
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-4">
            THE CHAD<span className="text-accent">WALLET</span> EXPERIENCE
          </h2>
          <p className="text-secondary text-sm mt-3 max-w-2xl mx-auto">
            Explore our state-of-the-art interface designed for high-frequency Solana traders.
          </p>
        </div>

        {/* Mobile View: Theme 3 - Curved 3D Carousel */}
        <div className="block md:hidden">
          <div className="flex justify-center gap-4 mb-6 z-30 relative">
            <button
              onClick={() => setTheme3Rotation(theme3Rotation + 40)}
              className="w-10 h-10 flex items-center justify-center bg-card border border-border rounded-full hover:border-accent hover:text-accent transition-all"
            >
              ←
            </button>
            <button
              onClick={() => setTheme3Rotation(theme3Rotation - 40)}
              className="w-10 h-10 flex items-center justify-center bg-card border border-border rounded-full hover:border-accent hover:text-accent transition-all"
            >
              →
            </button>
          </div>

          <div
            className="relative h-[440px] w-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing overflow-hidden"
            style={{ perspective: '1200px' }}
            onMouseDown={handleTheme3Start}
            onTouchStart={handleTheme3Start}
            onMouseMove={handleTheme3Move}
            onTouchMove={handleTheme3Move}
            onMouseUp={handleTheme3End}
            onTouchEnd={handleTheme3End}
            onMouseLeave={handleTheme3End}
          >
            {/* Cylinder */}
            <div
              className="relative w-[130px] h-[280px] transition-transform duration-500 ease-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${theme3Rotation}deg)`,
              }}
            >
              {APP_SCREENS.map((screen, idx) => {
                const angle = idx * 40
                const tzRadius = 190
                return (
                  <div
                    key={screen.id}
                    className="absolute inset-0 rounded-[20px] border-[2px] border-border bg-background overflow-hidden shadow-2xl backface-hidden"
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(${tzRadius}px)`,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <img
                      src={screen.image}
                      alt={screen.title}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent flex flex-col justify-end p-3">
                      <span className="text-[8px] font-bold text-accent uppercase tracking-wider">
                        {screen.label}
                      </span>
                      <h4 className="text-[10px] font-bold text-foreground mt-0.5">{screen.title}</h4>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Desktop View: Theme 4 - Bento Box Grid */}
        <div className="hidden md:block max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-6 auto-rows-[220px]">
            {APP_SCREENS.map((screen, idx) => {
              let gridClasses = "col-span-1 row-span-1"
              if (idx === 0) gridClasses = "col-span-2 row-span-2"
              if (idx === 3) gridClasses = "col-span-1 row-span-2"
              if (idx === 6) gridClasses = "col-span-2 row-span-1"

              const isDimmed = theme4HoveredIdx !== null && theme4HoveredIdx !== idx
              const isHovered = theme4HoveredIdx === idx

              return (
                <div
                  key={screen.id}
                  onMouseEnter={() => setTheme4HoveredIdx(idx)}
                  onMouseLeave={() => setTheme4HoveredIdx(null)}
                  className={`relative rounded-3xl border border-border bg-card/20 p-6 overflow-hidden flex gap-6 justify-between items-center transition-all duration-500 ease-out cursor-pointer ${gridClasses} ${isDimmed ? 'opacity-35 scale-[0.97] blur-[1px]' : 'opacity-100 scale-100'
                    } ${isHovered ? 'border-accent/50 shadow-accent/10 bg-card/60' : ''}`}
                >
                  <div className="flex-1 flex flex-col h-full justify-between z-10">
                    <div>
                      <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                        {screen.label}
                      </span>
                      <h3 className="text-xl font-black text-foreground mt-1 leading-tight">{screen.title}</h3>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed mt-2 max-w-[260px]">
                      {screen.desc}
                    </p>
                  </div>

                  <div className="relative flex-shrink-0 flex items-center justify-center overflow-hidden rounded-xl border border-border bg-background w-[110px] aspect-[9/19.5]">
                    <img
                      src={screen.image}
                      alt={screen.title}
                      className="w-full h-full object-cover select-none pointer-events-none"
                      draggable="false"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature Value Props */}
      <section className="px-6 py-24 border-t border-border bg-background/50">
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
              className="glass rounded-3xl p-8 hover:border-accent/30 transition-all duration-300 group"
            >
              <div className="text-4xl mb-6">{f.icon}</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="bg-accent/80 text-background py-16 text-center px-6">
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
              className="px-6 py-3 bg-foreground/60 text-background font-bold rounded-xl hover:brightness-110 transition-colors"
            >
              App Store
            </a>
            <a
              href={APP_LINKS.playStore}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-background/10 text-background border border-background/20 font-bold rounded-xl hover:bg-background/20 transition-colors"
            >
              Google Play
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo/light.png" alt="ChadWallet Logo" className="h-6 w-auto" />
            <span className="font-black text-foreground tracking-wider text-sm">
              CHAD<span className="text-accent">WALLET</span>
            </span>
          </div>
          <span className="text-xs text-secondary/50">
            © 2025 Chad Wallet L.L.C. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <a
              href={APP_LINKS.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-secondary hover:text-foreground transition-colors"
            >
              chadwallet.xyz
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
