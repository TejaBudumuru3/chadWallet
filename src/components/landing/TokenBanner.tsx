'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Token {
  address: string
  symbol: string
  logoURI: string
  price: number
  price24hChangePercent: number
}

export function TokenBanner() {
  const [tokens, setTokens] = useState<Token[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/tokens/trending')
      .then((r) => r.json())
      .then((d) => setTokens(d.tokens ?? []))
      .catch(() => {})
  }, [])

  if (!tokens.length) {
    return <div className="h-10 bg-[#C5F236]/10 animate-pulse" />
  }

  // Duplicate for seamless infinite scroll
  const doubled = [...tokens, ...tokens]

  return (
    <div className="overflow-hidden bg-zinc-900 border-b border-white/5 py-2 cursor-pointer select-none">
      <div className="flex gap-8 whitespace-nowrap animate-marquee">
        {doubled.map((token, i) => (
          <button
            key={`${token.address}-${i}`}
            onClick={() => router.push(`/trade?token=${token.address}`)}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
          >
            {token.logoURI && (
              <img
                src={token.logoURI}
                alt={token.symbol}
                className="w-5 h-5 rounded-full bg-black/20"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )}
            <span className="font-bold text-white text-sm">
              ${token.symbol}
            </span>
            <span
              className={`text-xs font-semibold ${
                token.price24hChangePercent >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {token.price24hChangePercent >= 0 ? '+' : ''}
              {token.price24hChangePercent?.toFixed(1)}%
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
