'use client'
import Link from 'next/link'
import { LoginButton } from '@/components/ui/LoginButton'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/logo/light.png"
          alt="ChadWallet Logo"
          className="h-7 w-auto object-contain"
          onError={(e) => {
            // Fallback if logo fails
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
        <span className="text-lg font-black text-white tracking-tight">
          CHAD<span className="text-[#C5F236]">WALLET</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <Link
          href="/trade"
          className="text-sm font-medium text-white/60 hover:text-[#C5F236] transition-colors"
        >
          Trade Terminal
        </Link>
      </div>

      <LoginButton />
    </nav>
  )
}
