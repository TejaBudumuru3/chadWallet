'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { APP_LINKS } from '@/lib/constants'
import { FlowDesign1 } from './FlowDesign1'
import { Zap, Users, Gem } from 'lucide-react'


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
  const [theme4HoveredIdx, setTheme4HoveredIdx] = useState<number | null>(null)
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

  useEffect(() => {
    // Autoplay fallback
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.play().catch((err) => {
        console.warn('Autoplay failed or interrupted:', err)
      })
    }
  }, [])

  // Animation variants for Hero text stagger
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Copy */}
        <motion.div
          className="lg:col-span-7 space-y-8 text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          <motion.div variants={itemVariants} className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-semibold text-accent tracking-wide uppercase">
              Now Live on Solana Mainnet
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05]">
            HUNT EVERY <br className="hidden sm:inline" />
            <span className="text-accent">MEMECOIN.</span>
            <br />
            EVERY CHAIN. <br className="hidden sm:inline" />
            <span className="text-secondary">ONE WALLET.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
            The fastest mobile trading wallet built for the Solana ecosystem.
            Instantly track wallets, copy trades, auto-buy on launch, and unlock
            features meant for the top 1%.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <motion.a
              href={APP_LINKS.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-accent text-background font-bold rounded-2xl hover:brightness-110 transition-colors shadow-[0_0_40px_rgba(197,242,54,0.3)] flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.27.74 2.96.76.7-.02 1.83-.81 3.41-.69 1.48.05 2.61.64 3.32 1.62-2.91 1.74-2.45 5.53.44 6.74-.75 1.87-1.46 3.6-2.13 4.54z" />
                <path d="M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.3-1.8 4.22-3.74 4.25z" />
              </svg>
              Get for iPhone
            </motion.a>
            <motion.a
              href={APP_LINKS.playStore}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-foreground/10 text-foreground font-bold rounded-2xl hover:bg-foreground/20 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M17.523 15.341l2.424-1.4c2.736-1.58 2.736-4.302 0-5.882l-2.424-1.4L12.75 11.43l4.773 3.91zM2.87 21.05c-.328.349-.87.054-.87-.433V3.383c0-.487.542-.782.87-.433l9.022 9.58-9.022 8.52zM11.892 12.43l5.069-4.148-12.7-7.332c-1.368-.79-2.261-.274-2.261 1.306L11.892 12.43zM11.892 11.43L2.001 21.744c0 1.58.893 2.096 2.261 1.306l12.7-7.332-5.07-4.288z" />
              </svg>
              Get for Android
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right Column: Hero Graphic */}
        <motion.div
          className="lg:col-span-5 relative flex justify-center items-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          <div className="relative w-[230px] sm:w-[250px] md:w-[270px] aspect-[9/19] rounded-[38px] border-[6px] border-border bg-background overflow-hidden ring-1 ring-border shadow-2xl">
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
        </motion.div>
      </section>

      {/* Text Marquee Strip */}


      {/* Section Header */}
      <section className="bg-background px-6 pt-24 pb-8">
        <motion.div 
          className="max-w-4xl mx-auto text-center space-y-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold text-accent tracking-widest uppercase">The Alpha Terminal</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            For Meme Coins &amp;<br />
            Smart Wallet Tracking
          </h2>
          <p className="text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            ChadWallet isn&apos;t just another trading tool — it&apos;s your edge in the meme coin casino. We track the smartest wallets on Solana and tell you what they&apos;re buying before it moons.
          </p>
        </motion.div>
      </section>

      {/* Core Flow Section (Theme 1: Immersive Theater) */}
      <FlowDesign1 flows={APP_FLOWS} />

      {/* Responsive App Screens Showcase Section */}
      <section className="py-24 bg-background border-t border-border relative overflow-hidden">
        <motion.div
          className="max-w-6xl mx-auto px-6 mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            Interface Tour
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-4">
            THE CHAD<span className="text-accent">WALLET</span> EXPERIENCE
          </h2>
          <p className="text-secondary text-sm mt-3 max-w-2xl mx-auto">
            Explore our state-of-the-art interface designed for high-frequency Solana traders.
          </p>
        </motion.div>

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
                <motion.div
                  key={screen.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  onMouseEnter={() => setTheme4HoveredIdx(idx)}
                  onMouseLeave={() => setTheme4HoveredIdx(null)}
                  className={`relative rounded-3xl border border-border bg-card/20 p-6 overflow-hidden flex gap-6 justify-between items-center transition-all duration-500 ease-out cursor-pointer ${gridClasses} ${isDimmed ? 'opacity-35 scale-[0.97] blur-[1px]' : 'opacity-100 scale-100'
                    } ${isHovered ? 'border-accent/50 shadow-accent/10 bg-card/60 shadow-2xl' : ''}`}
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
                </motion.div>
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
              icon: <Zap className="w-8 h-8 text-accent" />,
            },
            {
              title: 'Copy trading',
              desc: 'Subscribe to high-hit-rate wallets and execute identical transactions automatically as soon as they hit the chain.',
              icon: <Users className="w-8 h-8 text-accent" />,
            },
            {
              title: '$CHAD Loyalty Rewards',
              desc: 'Trade to earn points and claim $CHAD loyalty bonuses. Boost your returns with copy trade shares.',
              icon: <Gem className="w-8 h-8 text-accent" />,
            },
          ].map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100, damping: 20 }}
              className="glass rounded-3xl p-8 hover:border-accent/30 transition-all duration-300 group"
            >
              <div className="mb-6">{f.icon}</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-secondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="bg-accent/80 text-background py-16 text-center px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="max-w-2xl mx-auto space-y-6"
        >
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
        </motion.div>
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
