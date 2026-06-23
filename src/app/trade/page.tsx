'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'

function TradeContent() {
  const params = useSearchParams()
  const tokenAddress = params.get('token')

  return (
    <div className="flex-1 flex items-center justify-center text-white/30">
      <div className="text-center space-y-4">
        <div className="text-6xl">📈</div>
        <h2 className="text-2xl font-bold text-white/60">Trading Page</h2>
        {tokenAddress ? (
          <p className="text-sm font-mono text-[#C5F236]/60">
            Token: {tokenAddress.slice(0, 8)}...{tokenAddress.slice(-8)}
          </p>
        ) : (
          <p className="text-sm">Select a token from the banner to start trading</p>
        )}
        <p className="text-xs text-white/20">
          Three-column layout coming next: Token List | Chart + Trades | Buy/Sell
        </p>
      </div>
    </div>
  )
}

export default function TradePage() {
  return (
    <div className="flex flex-col h-screen bg-black">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-white/20">Loading...</div>}>
        <TradeContent />
      </Suspense>
    </div>
  )
}
