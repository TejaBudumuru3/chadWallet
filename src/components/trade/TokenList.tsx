'use client'
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

interface Token {
  address: string
  symbol: string
  name: string
  logoURI: string
  price: number
  price24hChangePercent: number
  v24hUSD?: number
}

interface TokenListProps {
  onSelectToken: (token: Token) => void
  selectedTokenAddress?: string
}

export function TokenList({ onSelectToken, selectedTokenAddress }: TokenListProps) {
  const [tokens, setTokens] = useState<Token[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tokens/trending')
      .then((res) => res.json())
      .then((data) => {
        const mapped = (data.tokens ?? []).map((t: any) => ({
          address: t.address,
          symbol: t.symbol,
          name: t.name,
          logoURI: t.logoURI,
          price: t.price ?? 0,
          price24hChangePercent: t.price24hChangePercent ?? t.v24hChangePercent ?? 0,
          v24hUSD: t.v24hUSD ?? 0,
        }))
        setTokens(mapped)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load tokens in sidebar:', err)
        setLoading(false)
      })
  }, [])



  const filteredTokens = tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.address.toLowerCase() === search.toLowerCase()
  )

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-white/5">
      {/* Search Header */}
      <div className="p-4 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search symbol or paste address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C5F236]/50 transition-colors"
          />
        </div>
      </div>

      {/* Markets List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
          Trending Markets
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-white/5" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-16 bg-white/5 rounded" />
                  <div className="h-2 w-10 bg-white/5 rounded" />
                </div>
                <div className="h-4 w-12 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="p-6 text-center text-sm text-white/30">No markets found</div>
        ) : (
          <div className="divide-y divide-white/2">
            {filteredTokens.map((token) => {
              const isSelected = selectedTokenAddress?.toLowerCase() === token.address.toLowerCase()
              const isUp = token.price24hChangePercent >= 0

              return (
                <button
                  key={token.address}
                  onClick={() => onSelectToken(token)}
                  className={`w-full flex items-center justify-between p-3.5 text-left transition-all cursor-pointer ${
                    isSelected ? 'bg-[#C5F236]/10 border-l-2 border-[#C5F236]' : 'hover:bg-white/2'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={token.logoURI || '/logo/light.png'}
                      alt={token.symbol}
                      className="w-7 h-7 rounded-full bg-white/10 flex-shrink-0"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = '/logo/light.png'
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white truncate">{token.symbol}</span>
                        <span className="text-[10px] text-white/40 font-mono hidden xl:inline">
                          {token.address.slice(0, 4)}...{token.address.slice(-4)}
                        </span>
                      </div>
                      <span className="text-xs text-white/45 truncate block">{token.name}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pl-2">
                    <div className="font-mono text-sm font-bold text-white">
                      ${token.price > 1 ? token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : token.price.toFixed(6)}
                    </div>
                    <div className={`text-xs font-semibold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                      {isUp ? '+' : ''}
                      {token.price24hChangePercent.toFixed(2)}%
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
