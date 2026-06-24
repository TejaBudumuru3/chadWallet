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
    return <div className="h-10 bg-accent/10 animate-pulse" />
  }

  // Duplicate for seamless infinite scroll
  const doubled = [...tokens, ...tokens]

  return (
    <div className="overflow-hidden bg-card border-b border-border py-2 select-none">
      <div className="flex gap-8 whitespace-nowrap animate-marquee">
        {doubled.map((token, i) => (
          <Link
            key={`${token.address}-${i}`}
            href={`/trade?token=${token.address}`}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
          >
            {token.logoURI && (
              <img
                src={token.logoURI}
                alt={token.symbol}
                className="w-5 h-5 rounded-full bg-background/20"
              />
            )}
            <span className="font-bold text-foreground text-sm">
              ${token.symbol}
            </span>
            <span
              className={`text-xs font-semibold ${
                token.price24hChangePercent >= 0
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {token.price24hChangePercent >= 0 ? '+' : ''}
              {token.price24hChangePercent?.toFixed(1)}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
