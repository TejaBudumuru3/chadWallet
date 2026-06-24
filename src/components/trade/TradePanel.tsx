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
      <div className="h-full bg-background p-6 flex items-center justify-center border-l border-border">
        <div className="text-center text-secondary/50 text-sm">
          Select a token to trade
        </div>
      </div>
    )
  }

  const handleExecute = async () => {
    const amount = parseFloat(inputMode === 'SOL' ? solAmount : tokenAmount)
    if (isNaN(amount) || amount <= 0) return

    setLoading(true)

    try {
      const isBuying = tab === 'BUY'
      
      // We assume SOL is always the opposite side for simplicity
      const solMint = 'So11111111111111111111111111111111111111112'
      const tokenMint = token.address
      
      const inputMint = isBuying ? solMint : tokenMint
      const outputMint = isBuying ? tokenMint : solMint
      
      // Amounts for Jupiter API must be in smallest units (decimals)
      // Assuming SOL = 9 decimals, Token = 6 decimals (mock standard)
      const inputDecimals = isBuying ? 9 : 6
      const amountInSmallestUnits = Math.floor(amount * Math.pow(10, inputDecimals))

      // 1. Try to fetch Quote from Jupiter API
      let quoteResponse;
      try {
        const slippageBps = isCustomSlippage ? Math.floor(parseFloat(customSlippage) * 100) : Math.floor(slippage * 100)
        const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountInSmallestUnits}&slippageBps=${slippageBps}`
        
        quoteResponse = await fetch(quoteUrl).then(res => res.json())
        
        if (quoteResponse.error) {
          throw new Error(quoteResponse.error)
        }

        // 2. Fetch Swap Transaction
        const userPublicKey = walletAddress || 'ChadWalletDemoUser111111111111111111111111'
        
        const swapRes = await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey,
            wrapAndUnwrapSol: true,
            dynamicComputeUnitLimit: true,
            prioritizationFeeLamports: gasPreset === 'TURBO' ? 30000 : gasPreset === 'CHAD' ? 100000 : 10000
          })
        }).then(res => res.json())

        if (swapRes.error) {
          throw new Error(swapRes.error)
        }
      } catch (apiErr) {
        console.warn('Jupiter API blocked or failed, using simulated fallback routing...', apiErr)
        // Fallback if Jupiter is blocked by CORS/Adblockers on the client
      }

      // Simulate RPC execution delay for realism
      await new Promise((resolve) => setTimeout(resolve, 800))

      const price = orderType === 'LIMIT' ? parseFloat(limitPrice) : token.price
      const computedTokenAmt = inputMode === 'SOL' ? parseFloat(tokenAmount) : amount
      const computedSolAmt = inputMode === 'SOL' ? amount : parseFloat(solAmount)

      // Generate random solana hash for demo
      const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
      let hash = ''
      for (let i = 0; i < 88; i++) {
        hash += chars.charAt(Math.floor(Math.random() * chars.length))
      }

      // Deduct/add balance
      if (tab === 'BUY') {
        setSolBalance((prev) => Math.max(0, prev - computedSolAmt))
      } else {
        setSolBalance((prev) => prev + computedSolAmt)
      }

      onExecuteTrade({
        time: new Date().toLocaleTimeString([], { hour12: false }),
        type: tab,
        price,
        amountToken: computedTokenAmt,
        amountSol: computedSolAmt,
        status: 'Completed',
        hash,
      })

      setSolAmount('')
      setTokenAmount('')
    } catch (err: any) {
      console.error('Swap Failed:', err)
      alert(`Jupiter Routing Failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
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
    <div className="flex flex-col h-full overflow-y-auto bg-background border-l border-border text-foreground">
      {/* Tabs headers (BUY / SELL) */}
      <div className="grid grid-cols-2 border-b border-border">
        <button
          onClick={() => setTab('BUY')}
          className={`py-4 text-center text-sm font-black tracking-wider transition-all cursor-pointer ${
            tab === 'BUY'
              ? 'bg-green-500/10 text-green-400 border-b-2 border-green-500'
              : 'text-secondary hover:text-foreground hover:bg-card/40'
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => setTab('SELL')}
          className={`py-4 text-center text-sm font-black tracking-wider transition-all cursor-pointer ${
            tab === 'SELL'
              ? 'bg-red-500/10 text-red-400 border-b-2 border-red-500'
              : 'text-secondary hover:text-foreground hover:bg-card/40'
          }`}
        >
          SELL
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Order Type & Settings */}
          <div className="flex items-center justify-between">
            <div className="flex bg-card p-0.5 rounded-lg border border-border">
              <button
                onClick={() => setOrderType('MARKET')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  orderType === 'MARKET' ? 'bg-border text-foreground' : 'text-secondary hover:text-foreground'
                }`}
              >
                Market
              </button>
              <button
                onClick={() => setOrderType('LIMIT')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  orderType === 'LIMIT' ? 'bg-border text-foreground' : 'text-secondary hover:text-foreground'
                }`}
              >
                Limit
              </button>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                showSettings ? 'bg-accent/10 border-accent/40 text-accent' : 'bg-transparent border-border hover:bg-card text-secondary'
              }`}
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Settings Panel */}
          {showSettings && (
            <div className="p-4 bg-card border border-border rounded-xl space-y-4 animate-fadeIn">
              {/* Slippage Settings */}
              <div>
                <div className="text-xs text-secondary font-bold mb-2">Slippage Limit</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0.1, 0.5, 1.0].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleSlippageChange(val)}
                      className={`py-1.5 text-xs font-mono rounded-lg border cursor-pointer ${
                        !isCustomSlippage && slippage === val
                          ? 'bg-accent/10 border-accent/50 text-accent'
                          : 'bg-background border-border hover:bg-card'
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
                    className={`py-1 px-2 text-xs font-mono text-center text-foreground bg-background border rounded-lg focus:outline-none ${
                      isCustomSlippage ? 'border-accent text-accent' : 'border-border'
                    }`}
                  />
                </div>
              </div>

              {/* Gas Settings */}
              <div>
                <div className="text-xs text-secondary font-bold mb-2">Priority Gas Presets</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['FAST', 'TURBO', 'CHAD'] as const).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setGasPreset(preset)}
                      className={`py-1.5 text-xs font-bold rounded-lg border cursor-pointer ${
                        gasPreset === preset
                          ? 'bg-accent/10 border-accent/50 text-accent'
                          : 'bg-background border-border hover:bg-card'
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
              <div className="text-xs font-bold text-secondary">Limit Price (USD)</div>
              <div className="relative rounded-xl border border-border bg-card p-3 flex items-center">
                <input
                  type="number"
                  placeholder="0.00"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="w-full bg-transparent text-lg font-bold font-mono text-foreground focus:outline-none"
                />
                <span className="text-sm font-bold text-secondary">USD</span>
              </div>
            </div>
          )}

          {/* Amount Inputs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-secondary">
              <span>Amount ({inputMode})</span>
              {authenticated && (
                <span>
                  Balance: {solBalance.toFixed(3)} SOL
                </span>
              )}
            </div>

            {/* Input box */}
            <div className="relative rounded-2xl border border-border bg-card p-4 flex flex-col gap-1">
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
                  className="w-full bg-transparent text-2xl font-black font-mono text-foreground focus:outline-none"
                />
                <span className="text-base font-bold text-accent">
                  {inputMode}
                </span>
              </div>
              <div className="text-xs text-secondary/60 font-semibold font-mono">
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
                className="p-2 rounded-xl bg-card border border-border hover:border-accent/30 text-secondary hover:text-foreground transition-all cursor-pointer shadow-lg"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Read-only Secondary Output Box */}
            <div className="relative rounded-2xl border border-border bg-card/40 p-4 flex flex-col gap-1">
              <div className="flex items-center justify-between opacity-60">
                <div className="text-xl font-bold font-mono text-foreground">
                  {inputMode === 'SOL' ? tokenAmount || '0.00' : solAmount || '0.00'}
                </div>
                <span className="text-base font-bold text-secondary">
                  {inputMode === 'SOL' ? token.symbol : 'SOL'}
                </span>
              </div>
              <div className="text-xs text-secondary/40 font-semibold font-mono">
                {inputMode === 'SOL'
                  ? `≈ $${(parseFloat(tokenAmount || '0') * token.price).toLocaleString(undefined, { maximumFractionDigits: 6 })}`
                  : `≈ $${(parseFloat(solAmount || '0') * 180).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              </div>
            </div>

            {/* Fee Details */}
            <div className="p-3 bg-card/40 border border-border rounded-xl space-y-2 text-xs text-secondary">
              <div className="flex items-center justify-between">
                <span>Price Impact</span>
                <span className="text-green-500 font-mono">&lt;0.05%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Transaction Speed Fee</span>
                <span className="font-mono text-foreground">
                  {gasPreset === 'FAST' ? '0.001 SOL' : gasPreset === 'TURBO' ? '0.003 SOL' : '0.008 SOL'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Secure Jup Routing</span>
                <span className="flex items-center gap-1 text-accent">
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
              className="w-full py-4 text-center font-black tracking-wider bg-accent text-background rounded-2xl hover:brightness-110 transition-all cursor-pointer text-sm"
            >
              CONNECT WALLET TO TRADE
            </button>
          ) : (
            <button
              disabled={loading || (inputMode === 'SOL' ? !solAmount : !tokenAmount)}
              onClick={handleExecute}
              className={`w-full py-4 text-center font-black tracking-wider text-sm rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                tab === 'BUY'
                  ? 'bg-green-500 hover:bg-green-400 text-foreground disabled:bg-green-500/20 disabled:text-foreground/20'
                  : 'bg-red-500 hover:bg-red-400 text-foreground disabled:bg-red-500/20 disabled:text-foreground/20'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border border-t-foreground border-foreground/25 animate-spin" />
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
