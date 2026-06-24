'use client'
import { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { ArrowUpDown, AlertCircle, Settings2, ShieldCheck, Zap } from 'lucide-react'

interface Token {
  address: string
  symbol: string
  name: string
  logoURI: string
  price: number
}

interface TradePanelProps {
  token?: Token
  onExecuteTrade: (trade: {
    time: string
    type: 'BUY' | 'SELL'
    price: number
    amountToken: number
    amountSol: number
    status: 'Completed' | 'Pending' | 'Failed'
    hash: string
  }) => void
}

export function TradePanel({ token, onExecuteTrade }: TradePanelProps) {
  const { ready, authenticated, login, user } = usePrivy()
  
  const [tab, setTab] = useState<'BUY' | 'SELL'>('BUY')
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET')
  
  const [inputMode, setInputMode] = useState<'SOL' | 'TOKEN'>('SOL')
  const [solAmount, setSolAmount] = useState('')
  const [tokenAmount, setTokenAmount] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  
  const [slippage, setSlippage] = useState(0.5)
  const [customSlippage, setCustomSlippage] = useState('')
  const [isCustomSlippage, setIsCustomSlippage] = useState(false)
  
  const [gasPreset, setGasPreset] = useState<'FAST' | 'TURBO' | 'CHAD'>('TURBO')
  const [loading, setLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Wallet address and balance logic
  const walletAddress = user?.wallet?.address
  const [solBalance, setSolBalance] = useState<number>(10.5) // Demo starting balance

  // Synchronize input fields
  useEffect(() => {
    if (!token) return
    const price = orderType === 'LIMIT' && limitPrice ? parseFloat(limitPrice) : token.price
    if (isNaN(price) || price <= 0) return

    if (inputMode === 'SOL') {
      const sol = parseFloat(solAmount)
      if (!isNaN(sol)) {
        // Assume 1 SOL = 180 USD for conversion (mock SOL price)
        const solInUsd = sol * 180
        const tokens = solInUsd / price
        setTokenAmount(tokens.toFixed(4))
      } else {
        setTokenAmount('')
      }
    } else {
      const tokens = parseFloat(tokenAmount)
      if (!isNaN(tokens)) {
        const tokensInUsd = tokens * price
        const sol = tokensInUsd / 180
        setSolAmount(sol.toFixed(4))
      } else {
        setSolAmount('')
      }
    }
  }, [solAmount, tokenAmount, inputMode, token, limitPrice, orderType])

  // Populate default limit price when token changes or orderType changes to LIMIT
  useEffect(() => {
    if (token) {
      setLimitPrice(token.price.toString())
    }
  }, [token, orderType])

  if (!token) {
    return (
      <div className="h-full bg-zinc-950 p-6 flex items-center justify-center border-l border-white/5">
        <div className="text-center text-white/30 text-sm">
          Select a token to trade
        </div>
      </div>
    )
  }

  const handleExecute = async () => {
    const amount = parseFloat(inputMode === 'SOL' ? solAmount : tokenAmount)
    if (isNaN(amount) || amount <= 0) return

    setLoading(true)

    // Simulate RPC execution delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const price = orderType === 'LIMIT' ? parseFloat(limitPrice) : token.price
    const computedTokenAmt = inputMode === 'SOL' ? parseFloat(tokenAmount) : amount
    const computedSolAmt = inputMode === 'SOL' ? amount : parseFloat(solAmount)

    // Generate random solana hash
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let hash = ''
    for (let i = 0; i < 44; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    // Deduct/add balance
    if (tab === 'BUY') {
      setSolBalance((prev) => Math.max(0, prev - computedSolAmt))
    } else {
      setSolBalance((prev) => prev + computedSolAmt)
    }

    onExecuteTrade({
      time: new Date().toLocaleTimeString(),
      type: tab,
      price,
      amountToken: computedTokenAmt,
      amountSol: computedSolAmt,
      status: 'Completed',
      hash,
    })

    setSolAmount('')
    setTokenAmount('')
    setLoading(false)
  }

  const handleSlippageChange = (val: number) => {
    setSlippage(val)
    setIsCustomSlippage(false)
  }

  const handleCustomSlippageChange = (val: string) => {
    setCustomSlippage(val)
    setIsCustomSlippage(true)
    const parsed = parseFloat(val)
    if (!isNaN(parsed)) {
      setSlippage(parsed)
    }
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-l border-white/5 text-white">
      {/* Tabs headers (BUY / SELL) */}
      <div className="grid grid-cols-2 border-b border-white/5">
        <button
          onClick={() => setTab('BUY')}
          className={`py-4 text-center text-sm font-black tracking-wider transition-all cursor-pointer ${
            tab === 'BUY'
              ? 'bg-green-500/10 text-green-400 border-b-2 border-green-500'
              : 'text-white/40 hover:text-white hover:bg-white/2'
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => setTab('SELL')}
          className={`py-4 text-center text-sm font-black tracking-wider transition-all cursor-pointer ${
            tab === 'SELL'
              ? 'bg-red-500/10 text-red-400 border-b-2 border-red-500'
              : 'text-white/40 hover:text-white hover:bg-white/2'
          }`}
        >
          SELL
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Order Type & Settings */}
          <div className="flex items-center justify-between">
            <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
              <button
                onClick={() => setOrderType('MARKET')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  orderType === 'MARKET' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                Market
              </button>
              <button
                onClick={() => setOrderType('LIMIT')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  orderType === 'LIMIT' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                Limit
              </button>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                showSettings ? 'bg-[#C5F236]/10 border-[#C5F236]/40 text-[#C5F236]' : 'bg-transparent border-white/5 hover:bg-white/5 text-white/50'
              }`}
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Settings Panel */}
          {showSettings && (
            <div className="p-4 bg-white/2 border border-white/5 rounded-xl space-y-4 animate-fadeIn">
              {/* Slippage Settings */}
              <div>
                <div className="text-xs text-white/55 font-bold mb-2">Slippage Limit</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0.1, 0.5, 1.0].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleSlippageChange(val)}
                      className={`py-1.5 text-xs font-mono rounded-lg border cursor-pointer ${
                        !isCustomSlippage && slippage === val
                          ? 'bg-[#C5F236]/10 border-[#C5F236]/50 text-[#C5F236]'
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                  <input
                    type="text"
                    placeholder="Custom"
                    value={customSlippage}
                    onChange={(e) => handleCustomSlippageChange(e.target.value)}
                    className={`py-1 px-2 text-xs font-mono text-center bg-white/5 border rounded-lg focus:outline-none ${
                      isCustomSlippage ? 'border-[#C5F236] text-[#C5F236]' : 'border-white/5'
                    }`}
                  />
                </div>
              </div>

              {/* Gas Settings */}
              <div>
                <div className="text-xs text-white/55 font-bold mb-2">Priority Gas Presets</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['FAST', 'TURBO', 'CHAD'] as const).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setGasPreset(preset)}
                      className={`py-1.5 text-xs font-bold rounded-lg border cursor-pointer ${
                        gasPreset === preset
                          ? 'bg-[#C5F236]/10 border-[#C5F236]/50 text-[#C5F236]'
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Limit Price Input */}
          {orderType === 'LIMIT' && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-white/40">Limit Price (USD)</div>
              <div className="relative rounded-xl border border-white/10 bg-white/5 p-3 flex items-center">
                <input
                  type="number"
                  placeholder="0.00"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="w-full bg-transparent text-lg font-bold font-mono text-white focus:outline-none"
                />
                <span className="text-sm font-bold text-white/35">USD</span>
              </div>
            </div>
          )}

          {/* Amount Inputs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white/40">
              <span>Amount ({inputMode})</span>
              {authenticated && (
                <span>
                  Balance: {solBalance.toFixed(3)} SOL
                </span>
              )}
            </div>

            {/* Input box */}
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  placeholder="0.0"
                  value={inputMode === 'SOL' ? solAmount : tokenAmount}
                  onChange={(e) => {
                    if (inputMode === 'SOL') {
                      setSolAmount(e.target.value)
                    } else {
                      setTokenAmount(e.target.value)
                    }
                  }}
                  className="w-full bg-transparent text-2xl font-black font-mono text-white focus:outline-none"
                />
                <span className="text-base font-bold text-[#C5F236]">
                  {inputMode}
                </span>
              </div>
              <div className="text-xs text-white/30 font-semibold font-mono">
                {inputMode === 'SOL'
                  ? `≈ $${(parseFloat(solAmount || '0') * 180).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                  : `≈ $${(parseFloat(tokenAmount || '0') * token.price).toLocaleString(undefined, { maximumFractionDigits: 6 })}`}
              </div>
            </div>

            {/* Swap Input Mode Button */}
            <div className="flex justify-center -my-2.5 relative z-10">
              <button
                onClick={() => {
                  setInputMode(inputMode === 'SOL' ? 'TOKEN' : 'SOL')
                  setSolAmount('')
                  setTokenAmount('')
                }}
                className="p-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-[#C5F236]/30 text-white/50 hover:text-white transition-all cursor-pointer shadow-lg"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Read-only Secondary Output Box */}
            <div className="relative rounded-2xl border border-white/5 bg-white/2 p-4 flex flex-col gap-1">
              <div className="flex items-center justify-between opacity-60">
                <div className="text-xl font-bold font-mono text-white">
                  {inputMode === 'SOL' ? tokenAmount || '0.00' : solAmount || '0.00'}
                </div>
                <span className="text-base font-bold text-white/50">
                  {inputMode === 'SOL' ? token.symbol : 'SOL'}
                </span>
              </div>
              <div className="text-xs text-white/20 font-semibold font-mono">
                {inputMode === 'SOL'
                  ? `≈ $${(parseFloat(tokenAmount || '0') * token.price).toLocaleString(undefined, { maximumFractionDigits: 6 })}`
                  : `≈ $${(parseFloat(solAmount || '0') * 180).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              </div>
            </div>

            {/* Fee Details */}
            <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-2 text-xs text-white/50">
              <div className="flex items-center justify-between">
                <span>Price Impact</span>
                <span className="text-green-500 font-mono">&lt;0.05%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Transaction Speed Fee</span>
                <span className="font-mono text-white">
                  {gasPreset === 'FAST' ? '0.001 SOL' : gasPreset === 'TURBO' ? '0.003 SOL' : '0.008 SOL'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Secure Jup Routing</span>
                <span className="flex items-center gap-1 text-[#C5F236]">
                  <ShieldCheck className="w-3.5 h-3.5" /> Direct RPC
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Execution CTA button */}
        <div className="pt-6">
          {!authenticated ? (
            <button
              onClick={login}
              className="w-full py-4 text-center font-black tracking-wider bg-[#C5F236] text-black rounded-2xl hover:brightness-110 transition-all cursor-pointer text-sm"
            >
              CONNECT WALLET TO TRADE
            </button>
          ) : (
            <button
              disabled={loading || (inputMode === 'SOL' ? !solAmount : !tokenAmount)}
              onClick={handleExecute}
              className={`w-full py-4 text-center font-black tracking-wider text-sm rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                tab === 'BUY'
                  ? 'bg-green-500 hover:bg-green-400 text-white disabled:bg-green-500/20 disabled:text-white/20'
                  : 'bg-red-500 hover:bg-red-400 text-white disabled:bg-red-500/20 disabled:text-white/20'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border border-t-white border-white/25 animate-spin" />
                  ROUTING SWAP ON CHAIN...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  {tab === 'BUY' ? `BUY ${token.symbol}` : `SELL ${token.symbol}`}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
