'use client'
import { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { TokenList } from '@/components/trade/TokenList'
import { TokenChart } from '@/components/trade/TokenChart'
import { TradePanel } from '@/components/trade/TradePanel'
import { Copy, Check, ExternalLink, RefreshCw, X, TrendingUp, Info } from 'lucide-react'

interface Token {
  address: string
  symbol: string
  name: string
  logoURI: string
  price: number
  price24hChangePercent: number
  v24hUSD?: number
}

interface Order {
  time: string
  type: 'BUY' | 'SELL'
  price: number
  amountToken: number
  amountSol: number
  status: 'Completed' | 'Pending' | 'Failed'
  hash: string
}

function TradeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tokenAddressFromUrl = searchParams.get('token')

  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeBottomTab, setActiveBottomTab] = useState<'ORDERS' | 'OVERVIEW' | 'NEWS'>('ORDERS')
  const [orders, setOrders] = useState<Order[]>([])
  const [mobileTab, setMobileTab] = useState<'CHART' | 'BOOK' | 'TRADE'>('CHART')
  const [toasts, setToasts] = useState<{ id: string; message: string; sub: string; hash?: string }[]>([])
  const urlTokenLoaded = useRef(false)

  // Load token from URL only once on mount
  useEffect(() => {
    if (tokenAddressFromUrl && !urlTokenLoaded.current) {
      urlTokenLoaded.current = true
      fetch(`/api/tokens/${tokenAddressFromUrl}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.data) {
            const t = json.data
            setSelectedToken({
              address: t.address,
              symbol: t.symbol,
              name: t.name,
              logoURI: t.logoURI,
              price: t.price ?? 0,
              price24hChangePercent: t.price24hChangePercent ?? t.v24hChangePercent ?? 0,
            })
          }
        })
        .catch((err) => console.error('Failed to load URL token:', err))
    }
  }, [tokenAddressFromUrl])

  const handleSelectToken = (token: Token) => {
    setSelectedToken(token)
    // Use history API directly to avoid Next.js router re-render cycle
    window.history.replaceState(null, '', `/trade?token=${token.address}`)
  }

  const handleCopyAddress = () => {
    if (!selectedToken) return
    navigator.clipboard.writeText(selectedToken.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const addToast = (message: string, sub: string, hash?: string) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, sub, hash }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }

  const handleExecuteTrade = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev])
    addToast(
      `${newOrder.type} Successful`,
      `Exchanged ${newOrder.amountSol.toFixed(3)} SOL for ${newOrder.amountToken.toFixed(2)} ${selectedToken?.symbol}`,
      newOrder.hash
    )
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Pre-configured mock market overview data
  const marketOverview = [
    { name: 'Bitcoin', symbol: 'BTC', price: '$67,954.20', change: '+2.41%', up: true },
    { name: 'Ethereum', symbol: 'ETH', price: '$3,485.50', change: '-1.15%', up: false },
    { name: 'Solana', symbol: 'SOL', price: '$180.25', change: '+4.83%', up: true },
    { name: 'Ripple', symbol: 'XRP', price: '$0.5420', change: '-0.38%', up: false },
    { name: 'Cardano', symbol: 'ADA', price: '$0.4285', change: '+1.02%', up: true },
  ]

  // Pre-configured news alerts data
  const newsAlerts = [
    {
      title: 'Solana active addresses reach all-time high of 2.4 million as trade activity surges',
      category: 'Network',
      time: '10m ago',
    },
    {
      title: 'Jupiter aggregators now route over 60% of all decentralized exchange volume on Solana Mainnet',
      category: 'DeFi',
      time: '1h ago',
    },
    {
      title: 'ChadWallet launches on iOS App Store, trending in top 5 free utilities',
      category: 'Growth',
      time: '4h ago',
    },
    {
      title: 'SEC drops investigation into Ethereum 2.0 consolidation; ether rallies past $3,500',
      category: 'Regulation',
      time: '6h ago',
    },
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-black text-white relative">
      {/* Top Token Detail Bar */}
      {selectedToken && (
        <div className="bg-zinc-950 border-b border-white/5 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={selectedToken.logoURI || '/logo/light.png'}
              alt={selectedToken.symbol}
              className="w-8 h-8 rounded-full bg-white/10"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = '/logo/light.png'
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-white">{selectedToken.name}</span>
                <span className="text-xs font-mono text-[#C5F236] bg-[#C5F236]/10 px-2 py-0.5 rounded font-bold">
                  {selectedToken.symbol}
                </span>
              </div>
              <button
                onClick={handleCopyAddress}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors mt-0.5"
              >
                <span className="font-mono">{selectedToken.address.slice(0, 12)}...{selectedToken.address.slice(-12)}</span>
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Pricing Metrics */}
          <div className="flex items-center gap-6 flex-wrap font-mono">
            <div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Price</div>
              <div className="text-sm font-black text-white">
                ${selectedToken.price > 1 ? selectedToken.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : selectedToken.price.toFixed(6)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">24h Change</div>
              <div className={`text-sm font-black ${selectedToken.price24hChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {selectedToken.price24hChangePercent >= 0 ? '+' : ''}
                {selectedToken.price24hChangePercent.toFixed(2)}%
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">24h High</div>
              <div className="text-sm font-bold text-white">
                ${(selectedToken.price * 1.05).toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">24h Low</div>
              <div className="text-sm font-bold text-white">
                ${(selectedToken.price * 0.94).toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">24h Volume</div>
              <div className="text-sm font-bold text-white">
                ${selectedToken.v24hUSD ? selectedToken.v24hUSD.toLocaleString() : '842,500'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Terminal Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
        
        {/* Mobile Sub-Navigation Header */}
        <div className="md:hidden grid grid-cols-3 bg-zinc-950 border-b border-white/5">
          <button
            onClick={() => setMobileTab('CHART')}
            className={`py-3 text-center text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'CHART' ? 'text-[#C5F236] border-b border-[#C5F236]' : 'text-white/40'
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setMobileTab('BOOK')}
            className={`py-3 text-center text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'BOOK' ? 'text-[#C5F236] border-b border-[#C5F236]' : 'text-white/40'
            }`}
          >
            Order Book
          </button>
          <button
            onClick={() => setMobileTab('TRADE')}
            className={`py-3 text-center text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'TRADE' ? 'text-[#C5F236] border-b border-[#C5F236]' : 'text-white/40'
            }`}
          >
            Trade Console
          </button>
        </div>

        {/* Column 1: Left Markets / Tokens (Hidden on Mobile) */}
        <div className="hidden md:block md:col-span-3 lg:col-span-2 h-full min-h-0">
          <TokenList
            onSelectToken={handleSelectToken}
            selectedTokenAddress={selectedToken?.address}
          />
        </div>

        {/* Column 2: Center Chart & Info */}
        <div className={`md:col-span-5 lg:col-span-7 h-full flex flex-col min-h-0 overflow-y-auto border-r border-white/5 ${
          mobileTab !== 'CHART' ? 'hidden md:flex' : 'flex'
        }`}>
          <div className="p-4 flex-1 flex flex-col gap-4 min-h-[460px]">
            {selectedToken && (
              <TokenChart
                tokenAddress={selectedToken.address}
                tokenSymbol={selectedToken.symbol}
                tokenPrice={selectedToken.price}
                priceChangePercent={selectedToken.price24hChangePercent}
              />
            )}

            {/* Bottom Tabbed Console */}
            <div className="flex-1 bg-zinc-950 border border-white/5 rounded-2xl flex flex-col min-h-[300px]">
              {/* Tabs */}
              <div className="flex border-b border-white/5 bg-zinc-900/50 rounded-t-2xl">
                <button
                  onClick={() => setActiveBottomTab('ORDERS')}
                  className={`px-6 py-3.5 text-xs font-bold border-r border-white/5 transition-all cursor-pointer ${
                    activeBottomTab === 'ORDERS'
                      ? 'bg-zinc-950 text-[#C5F236]'
                      : 'text-white/45 hover:text-white'
                  }`}
                >
                  Recent Swaps ({orders.length})
                </button>
                <button
                  onClick={() => setActiveBottomTab('OVERVIEW')}
                  className={`px-6 py-3.5 text-xs font-bold border-r border-white/5 transition-all cursor-pointer ${
                    activeBottomTab === 'OVERVIEW'
                      ? 'bg-zinc-950 text-[#C5F236]'
                      : 'text-white/45 hover:text-white'
                  }`}
                >
                  Market Overview
                </button>
                <button
                  onClick={() => setActiveBottomTab('NEWS')}
                  className={`px-6 py-3.5 text-xs font-bold transition-all cursor-pointer ${
                    activeBottomTab === 'NEWS'
                      ? 'bg-zinc-950 text-[#C5F236]'
                      : 'text-white/45 hover:text-white'
                  }`}
                >
                  News & Alerts
                </button>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 p-4 overflow-y-auto">
                {activeBottomTab === 'ORDERS' && (
                  <div className="w-full">
                    {orders.length === 0 ? (
                      <div className="h-44 flex flex-col items-center justify-center text-white/30 text-sm gap-2">
                        <TrendingUp className="w-6 h-6 opacity-40" />
                        <span>No transactions executed yet</span>
                        <span className="text-xs text-white/20">Submit a buy or sell order above</span>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse font-mono text-xs">
                          <thead>
                            <tr className="border-b border-white/5 text-white/40 pb-2">
                              <th className="py-2">Time</th>
                              <th className="py-2">Type</th>
                              <th className="py-2">Price</th>
                              <th className="py-2">Amount (Token)</th>
                              <th className="py-2">SOL Equivalent</th>
                              <th className="py-2">Tx Hash</th>
                              <th className="py-2 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/2">
                            {orders.map((o, idx) => (
                              <tr key={idx} className="hover:bg-white/2">
                                <td className="py-2.5 text-white/60">{o.time}</td>
                                <td className={`py-2.5 font-bold ${o.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                                  {o.type}
                                </td>
                                <td className="py-2.5 text-white">
                                  ${o.price > 1 ? o.price.toFixed(2) : o.price.toFixed(6)}
                                </td>
                                <td className="py-2.5 text-white font-bold">{o.amountToken.toFixed(2)}</td>
                                <td className="py-2.5 text-white">{o.amountSol.toFixed(3)} SOL</td>
                                <td className="py-2.5">
                                  <a
                                    href={`https://solscan.io/tx/${o.hash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline"
                                  >
                                    {o.hash.slice(0, 4)}...{o.hash.slice(-4)}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </td>
                                <td className="py-2.5 text-right">
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/15 border border-green-500/30 text-green-400 font-bold uppercase">
                                    {o.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeBottomTab === 'OVERVIEW' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {marketOverview.map((item) => (
                      <div
                        key={item.symbol}
                        className="bg-white/2 border border-white/5 rounded-xl p-3.5 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs text-white/40 font-bold">{item.name}</div>
                          <div className="text-sm font-black font-mono text-white mt-1">{item.price}</div>
                        </div>
                        <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          item.up ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {item.change}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeBottomTab === 'NEWS' && (
                  <div className="space-y-4">
                    {newsAlerts.map((n, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3.5 p-3.5 bg-white/2 border border-white/5 rounded-xl hover:border-white/10 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-[#C5F236]/10 text-[#C5F236]">
                          <Info className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold leading-relaxed text-white">{n.title}</h4>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-white/40 font-semibold">
                            <span className="px-2 py-0.5 rounded bg-white/5 text-white/60">
                              {n.category}
                            </span>
                            <span>{n.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Order Book & Buy/Sell Pane */}
        <div className={`md:col-span-4 lg:col-span-3 h-full flex flex-col min-h-0 overflow-y-auto divide-y divide-white/5 ${
          mobileTab === 'CHART' ? 'hidden md:flex' : mobileTab === 'BOOK' ? 'flex' : 'hidden md:flex'
        }`}>
          {/* Order Book Simulator */}
          {selectedToken && (
            <div className="p-4 bg-zinc-950/40">
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                Order Book
              </div>
              <div className="space-y-3 font-mono text-xs">
                {/* Asks (Sell Orders) */}
                <div className="space-y-1">
                  {[1.04, 1.03, 1.02, 1.01].map((multiplier, i) => {
                    const price = selectedToken.price * multiplier
                    const amount = 1.25 * (i + 1) * Math.random()
                    const total = price * amount
                    return (
                      <div key={i} className="flex justify-between relative py-0.5 px-1.5 rounded hover:bg-white/5 cursor-pointer">
                        <div className="absolute inset-y-0 right-0 bg-red-500/10 transition-all" style={{ width: `${30 + i * 15}%` }} />
                        <span className="text-red-500 font-bold z-10">
                          {price > 1 ? price.toFixed(2) : price.toFixed(6)}
                        </span>
                        <span className="text-white/60 z-10">{amount.toFixed(2)}</span>
                        <span className="text-white/40 z-10">{total.toFixed(2)}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Spread Display */}
                <div className="py-2 border-y border-white/5 flex justify-between items-center text-xs font-bold">
                  <span className="text-white/50">Spread</span>
                  <span className="text-[#C5F236] font-mono">0.02%</span>
                  <span className="text-white">
                    ${selectedToken.price > 1 ? selectedToken.price.toFixed(2) : selectedToken.price.toFixed(6)}
                  </span>
                </div>

                {/* Bids (Buy Orders) */}
                <div className="space-y-1">
                  {[0.99, 0.98, 0.97, 0.96].map((multiplier, i) => {
                    const price = selectedToken.price * multiplier
                    const amount = 2.1 * (i + 1) * Math.random()
                    const total = price * amount
                    return (
                      <div key={i} className="flex justify-between relative py-0.5 px-1.5 rounded hover:bg-white/5 cursor-pointer">
                        <div className="absolute inset-y-0 right-0 bg-green-500/10 transition-all" style={{ width: `${20 + i * 20}%` }} />
                        <span className="text-green-500 font-bold z-10">
                          {price > 1 ? price.toFixed(2) : price.toFixed(6)}
                        </span>
                        <span className="text-white/60 z-10">{amount.toFixed(2)}</span>
                        <span className="text-white/40 z-10">{total.toFixed(2)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Trade Execution Pane */}
          <div className="flex-1 bg-zinc-950">
            {selectedToken && (
              <TradePanel
                token={selectedToken}
                onExecuteTrade={handleExecuteTrade}
              />
            )}
          </div>
        </div>

        {/* Mobile Mode: Separate Tab overlay for Trade console */}
        <div className={`md:hidden col-span-1 h-full min-h-0 bg-zinc-950 ${
          mobileTab !== 'TRADE' ? 'hidden' : 'block'
        }`}>
          {selectedToken && (
            <TradePanel
              token={selectedToken}
              onExecuteTrade={handleExecuteTrade}
            />
          )}
        </div>

      </div>

      {/* Floating interactive toast notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3 w-80">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="p-4 bg-zinc-900/95 border border-white/10 rounded-2xl shadow-2xl flex items-start justify-between gap-3 animate-fadeIn backdrop-blur-md"
          >
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white">{toast.message}</h4>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">{toast.sub}</p>
              {toast.hash && (
                <a
                  href={`https://solscan.io/tx/${toast.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[10px] font-mono text-blue-400 mt-2 hover:underline"
                >
                  View on Solscan
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TradePage() {
  return (
    <div className="flex flex-col h-screen bg-black">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-[#C5F236] border-white/10 animate-spin" />
          <span>Syncing Terminal Ledger...</span>
        </div>
      }>
        <TradeContent />
      </Suspense>
    </div>
  )
}
