import Link from 'next/link'
import { getTrendingTokens } from '@/lib/birdeye'
import { getCached } from '@/lib/cache'

interface Token {
  address: string
  symbol: string
  logoURI: string
  price: number
  price24hChangePercent: number
}

export async function TokenBanner() {
  let tokens: Token[] = []
  try {
    tokens = await getCached(
      'trending_tokens',
      60_000,
      () => getTrendingTokens(30)
    )
  } catch (err) {
    console.error('Failed to fetch trending tokens for banner', err)
  }

  if (!tokens.length) {
    return <div className="h-12 bg-[#09090b] animate-pulse" />
  }

  // Duplicate for seamless infinite scroll
  const doubled = [...tokens, ...tokens]

  return (
    <div className="overflow-hidden bg-[#09090b] border-b border-white/5 py-2 select-none flex items-center">
      {/* Static text on the left */}
      <div className="z-10 bg-[#09090b] px-4 py-2 border-r border-white/5 shadow-[10px_0_15px_-3px_rgba(9,9,11,1)]">
        <span className="text-foreground font-black text-[10px] tracking-widest whitespace-nowrap uppercase">
          Tap Any Ticker To Trade
        </span>
      </div>

      {/* Scrolling container */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex gap-3 whitespace-nowrap animate-marquee items-center pl-4">
          {doubled.map((token, i) => (
            <Link
              key={`${token.address}-${i}`}
              href={`/trade?token=${token.address}`}
              className="flex items-center rounded-full px-3 py-1.5 border border-white/10 bg-white/5 gap-2 hover:bg-white/10 transition-colors cursor-pointer"
            >
              {token.logoURI && (
                <img
                  src={token.logoURI}
                  alt={token.symbol}
                  className="w-4 h-4 rounded-full bg-background/20"
                />
              )}
              <span className="font-bold text-white text-xs">
                {token.symbol}
              </span>
              <span className="text-zinc-400 text-xs font-mono">
                ${token.price?.toFixed(token.price < 0.01 ? 6 : 2)}
              </span>
              <span
                className={`text-xs font-semibold ${token.price24hChangePercent >= 0
                  ? 'text-green-500'
                  : 'text-red-500'
                  }`}
              >
                {token.price24hChangePercent >= 0 ? '+' : ''}
                {token.price24hChangePercent?.toFixed(2)}%
              </span>
              {/* Optional tiny arrow icon here if needed */}
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-600 ml-1">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
