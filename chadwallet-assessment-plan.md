# ChadWallet Founding Engineer Assessment — Complete Execution Plan

**Role:** Founding Engineer  
**Deadline:** June 28, 2025 (6 days from today)  
**Verdict:** Strong GO. This is winnable.

---

## 1. Difficulty Assessment: 7.5 / 10

| Layer | Difficulty | Why |
|---|---|---|
| Landing page (fomo.family clone) | 6/10 | High design bar, crypto-native aesthetic |
| Privy auth (Apple + Google) | 4/10 | SDK is excellent, mostly config |
| Solana support | 4/10 | Privy handles embedded wallet creation |
| Rotating token banners | 5/10 | BirdEye API + CSS marquee |
| Trading page — token list | 4/10 | BirdEye REST, simple table |
| Trading page — chart | 7/10 | TradingView widget/library setup |
| Trading page — live trades/holders | 6/10 | BirdEye polling, realtime display |
| Trading page — buy/sell (Jupiter) | 9/10 | Transaction signing, swap flow |

**Total time estimate:**
- Minimum (landing + auth + banners): 18–22 hours
- Bonus (trading page without Jupiter swap): +14–16 hours
- Full bonus (with Jupiter swap): +8 hours more

**Recommendation:** Ship the minimum perfectly, build 80% of the trading page, mock only Jupiter swap execution. That will pass and impress more than a broken full version.

---

## 2. What They Are Actually Testing

This is a founding engineer screen. The bar is higher than a typical take-home. They want to see:

1. **Speed + judgment** — Can you ship live, working product fast while picking the right tradeoffs?
2. **Crypto-native product intuition** — Does your UI look like you've used these apps, not just coded them?
3. **Real data discipline** — The brief explicitly says "power the app with real data." Mocked UIs fail here.
4. **Multi-API integration competence** — 5+ APIs working together without breaking.
5. **Deployment** — They asked for a live preview URL. Vercel is non-negotiable.

**What kills you:**
- UI that looks like a generic Next.js SaaS template instead of a crypto trading app
- Mocked token prices instead of BirdEye data
- Auth that doesn't work
- No live URL at submission

---

## 3. Requirements Breakdown with Time Estimates

### Minimum (Required)

**A. Landing page like fomo.family**
- Dark background (#0a0a0a or #000)
- Loud hero section: app name, tagline, CTA buttons (App Store / Play Store links provided)
- Screenshots or mockups of the mobile app
- Social proof / feature highlights section
- Footer
- Fully responsive
- **Time: 6–8 hours**

**B. Sign in with Apple/Google through Privy**
- Privy account → create app → enable Apple + Google OAuth
- Wrap app in `PrivyProvider`
- Login modal via `useLogin()` hook
- Display wallet address post-login
- **Time: 2–3 hours**

**C. Solana support**
- Privy embedded wallet config with Solana chain
- User gets a Solana wallet on first login automatically
- **Time: 1 hour (config only)**

**D. Rotating token banners (top + bottom)**
- BirdEye API → fetch trending tokens (top 20–30)
- CSS marquee animation (infinite scroll left)
- Each token shows: logo, symbol, price, 24h change %
- Click → navigate to `/trade/[token_address]`
- Two instances: top of landing page, bottom of landing page
- **Time: 4–5 hours**

### Bonus (Trading Page)

**E. Left: Trending tokens list**
- Reuse BirdEye trending tokens data
- Sortable table: logo, name, price, 24h change, volume
- Click → loads token in middle panel
- **Time: 3–4 hours**

**F. Middle: Token info + price chart + holders + live trades**
- Token header: logo, name, contract address, market cap, FDV
- TradingView chart (price data via TradingView widget or BirdEye OHLCV)
- Holders list: BirdEye token security endpoint
- Live trades feed: BirdEye trades endpoint, polling every 5–10 seconds
- **Time: 6–8 hours**

**G. Right: Buy & Sell + user position**
- Input fields: token amount, SOL amount
- Price impact display
- Jupiter quote API (read-only, show quote without executing)
- User's SOL balance via Alchemy RPC
- User's token balance via Alchemy or Privy wallet
- Swap button (can be UI-only or wired to Jupiter swap — see risk section)
- **Time: 5–6 hours**

---

## 4. Project Setup (Do This First — 2 Hours)

### Initialize Project

```bash
npx create-next-app@latest chadwallet --typescript --tailwind --app --src-dir
cd chadwallet
npm install @privy-io/react-auth @privy-io/server-auth
npm install @solana/web3.js
npm install @jup-ag/react-hook
npm install framer-motion
npm install lucide-react
npm install @supabase/supabase-js
```

### Environment Variables (.env.local)

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

BIRDEYE_API_KEY=your_birdeye_api_key
NEXT_PUBLIC_ALCHEMY_RPC=https://solana-mainnet.g.alchemy.com/v2/your_key

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: if you use Supabase server-side
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Deploy to Vercel Immediately

```bash
npx vercel --yes
```

Push to GitHub, link repo in Vercel. Add all env vars in Vercel dashboard. Every `git push` auto-deploys. This means on Day 6 you just push and share the URL — no scramble.

---

## 5. Project Structure

```
src/
├── app/
│   ├── layout.tsx              # PrivyProvider wrapper
│   ├── page.tsx                # Landing page
│   ├── trade/
│   │   └── page.tsx            # Trading page (optional: [address]/page.tsx)
│   └── api/
│       ├── tokens/
│       │   ├── trending/route.ts       # GET /api/tokens/trending
│       │   ├── [address]/route.ts      # GET /api/tokens/[address]
│       │   ├── [address]/trades/route.ts
│       │   └── [address]/holders/route.ts
│       └── quote/route.ts             # Jupiter quote proxy
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── TokenBanner.tsx      # Reused top + bottom
│   │   ├── Features.tsx
│   │   └── AppDownload.tsx
│   ├── trade/
│   │   ├── TokenList.tsx        # Left panel
│   │   ├── TokenChart.tsx       # Middle: TradingView
│   │   ├── TokenInfo.tsx        # Middle: header
│   │   ├── LiveTrades.tsx       # Middle: trades feed
│   │   ├── HoldersList.tsx      # Middle: holders
│   │   └── TradePanel.tsx       # Right panel: buy/sell
│   └── ui/
│       ├── LoginButton.tsx
│       └── WalletDisplay.tsx
└── lib/
    ├── birdeye.ts
    ├── alchemy.ts
    └── constants.ts
```

---

## 6. Day-by-Day Execution Plan

### Day 1 (Today, June 22) — Foundation
**Goal: Project running live on Vercel, auth working.**

- [ ] Create Next.js project, push to GitHub, deploy to Vercel
- [ ] Sign up: Privy, BirdEye, Alchemy (all free tier)
- [ ] Configure Privy: enable Google + Apple OAuth, enable Solana embedded wallets
- [ ] Download ChadWallet brand assets from Google Drive
- [ ] Implement `PrivyProvider` in `layout.tsx`
- [ ] Build `LoginButton` — opens Privy modal on click
- [ ] Build `Navbar` with logo + login button
- [ ] Verify Google login works end-to-end on live Vercel URL
- [ ] Build API route `/api/tokens/trending` hitting BirdEye
- [ ] Test BirdEye response in browser

**End of Day 1 checkpoint:** Vercel URL is live, Google login works, BirdEye returns token data.

---

### Day 2 (June 23) — Landing Page

**Goal: Landing page looks like fomo.family with ChadWallet branding.**

- [ ] Build `Hero` component: big headline, subheadline, two CTA buttons (App Store / Play Store with real links from assessment)
- [ ] Build `TokenBanner` component with marquee animation (see code below)
- [ ] Place banners: one below navbar, one above footer
- [ ] Build `Features` section: 3–4 feature highlights (Solana, fast trades, secure wallet)
- [ ] Build `AppDownload` section: phone mockup, download badges
- [ ] Build `Footer`
- [ ] Apply ChadWallet colors from brand assets
- [ ] Make fully responsive (mobile first)

**Design reference for fomo.family:**
- Black background, no white space bleeding
- Accent: neon green/yellow or brand color from ChadWallet assets
- Large bold display font (Inter or Space Grotesk)
- Glassmorphism cards for feature highlights
- Gradient text on headline

---

### Day 3 (June 24) — BirdEye Integration + Banner Polish

**Goal: Banners show real token data, click navigates to trade page.**

- [ ] Extend BirdEye lib: trending, token overview, trades, holders
- [ ] Add Next.js API route caching (60-second revalidation) to avoid BirdEye rate limits
- [ ] Polish `TokenBanner`: logos, prices with color-coded change %, smooth animation, pausable on hover
- [ ] Wire banner click: `router.push('/trade?token=${address}')`
- [ ] Build empty trading page shell at `/trade` so navigation works
- [ ] Add loading skeletons to banner

---

### Day 4 (June 25) — Trading Page Left + Middle (Info + Chart)

**Goal: Trading page layout with token list and chart working.**

- [ ] Build three-column trading layout (resizable or fixed)
- [ ] Left panel: `TokenList` — trending tokens table with live prices
- [ ] Middle panel top: `TokenInfo` — token name, price, market cap, 24h change, FDV
- [ ] Middle panel chart: `TokenChart` — TradingView widget (see code below)
- [ ] Handle URL query param: `/trade?token=ADDRESS` loads that token in middle panel

---

### Day 5 (June 26) — Trading Page Live Feeds + Right Panel

**Goal: Live trades, holders, buy/sell UI.**

- [ ] Middle panel: `LiveTrades` — poll BirdEye every 8 seconds, show recent swaps (wallet, in/out token, amount, time)
- [ ] Middle panel: `HoldersList` — top holders from BirdEye security endpoint
- [ ] Right panel: `TradePanel` — buy/sell tabs, amount inputs, price impact, user SOL balance
- [ ] Fetch user SOL balance via Alchemy RPC when wallet connected
- [ ] Jupiter quote integration (read-only — show quote, estimated output)
- [ ] Right panel: user's token position (if connected)

---

### Day 6 (June 27) — Polish, Mobile, Edge Cases

**Goal: The app looks shippable, not hacky.**

- [ ] Mobile responsiveness audit — trading page collapses to tabs on mobile
- [ ] Loading states everywhere (skeletons, not spinners)
- [ ] Error states (BirdEye down, wallet not connected)
- [ ] Copy contract address button on token info
- [ ] Token search in left panel
- [ ] Smooth transitions between token selections
- [ ] Page metadata (title, OG image)

---

### Day 7 (June 28) — Final QA + Submit

- [ ] End-to-end test: land → login → click banner → trade page loads → buy panel shows
- [ ] Test on mobile (real device or Chrome DevTools)
- [ ] Test with Apple login (requires real device or browser)
- [ ] Final Vercel deploy
- [ ] Reply to recruiter with live URL + brief what's included

---

## 7. Key Code Implementations

### Privy Setup (`app/layout.tsx`)

```tsx
'use client'
import { PrivyProvider } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'

const solanaConnectors = toSolanaWalletConnectors({ shouldAutoConnect: true })

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['google', 'apple'],
        appearance: {
          theme: 'dark',
          accentColor: '#your_brand_color',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          solanaChainIds: ['mainnet-beta'],
        },
        externalWallets: { solana: { connectors: solanaConnectors } },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
```

**Privy dashboard config (do this before coding):**
1. Go to privy.io → create app
2. Login Methods → enable Google, enable Apple
3. Embedded Wallets → enable Solana
4. Add your Vercel domain to allowed origins

---

### BirdEye Library (`lib/birdeye.ts`)

```typescript
const BASE_URL = 'https://public-api.birdeye.so'
const HEADERS = {
  'X-API-KEY': process.env.BIRDEYE_API_KEY!,
  'x-chain': 'solana',
}

export async function getTrendingTokens(limit = 30) {
  const url = `${BASE_URL}/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=${limit}&min_liquidity=10000`
  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 60 } })
  const data = await res.json()
  return data.data?.tokens ?? []
}

export async function getTokenOverview(address: string) {
  const url = `${BASE_URL}/defi/token_overview?address=${address}`
  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 30 } })
  const data = await res.json()
  return data.data
}

export async function getTokenTrades(address: string, limit = 50) {
  const url = `${BASE_URL}/defi/txs/token?address=${address}&tx_type=swap&limit=${limit}`
  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 10 } })
  const data = await res.json()
  return data.data?.items ?? []
}

export async function getTokenHolders(address: string) {
  const url = `${BASE_URL}/v1/token/holder?address=${address}&offset=0&limit=20`
  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 60 } })
  const data = await res.json()
  return data.data?.items ?? []
}

export async function getTokenOHLCV(address: string, timeframe = '15m') {
  const now = Math.floor(Date.now() / 1000)
  const from = now - 60 * 60 * 24 // 24 hours
  const url = `${BASE_URL}/defi/ohlcv?address=${address}&type=${timeframe}&time_from=${from}&time_to=${now}`
  const res = await fetch(url, { headers: HEADERS })
  const data = await res.json()
  return data.data?.items ?? []
}
```

---

### API Routes with Caching (`app/api/tokens/trending/route.ts`)

```typescript
import { NextResponse } from 'next/server'
import { getTrendingTokens } from '@/lib/birdeye'

export const revalidate = 60 // cache for 60 seconds

export async function GET() {
  try {
    const tokens = await getTrendingTokens(30)
    return NextResponse.json({ tokens })
  } catch (err) {
    return NextResponse.json({ tokens: [], error: 'Failed to fetch' }, { status: 500 })
  }
}
```

**Why route through your own API:** BirdEye API key never leaks to client. You control caching. One BirdEye call serves many users.

---

### Token Banner Component (`components/landing/TokenBanner.tsx`)

```tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Token {
  address: string
  symbol: string
  logoURI: string
  price: number
  priceChange24hPercent: number
}

export function TokenBanner() {
  const [tokens, setTokens] = useState<Token[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/tokens/trending')
      .then(r => r.json())
      .then(d => setTokens(d.tokens ?? []))
  }, [])

  if (!tokens.length) return <div className="h-10 bg-black/40 animate-pulse" />

  const doubled = [...tokens, ...tokens] // duplicate for seamless loop

  return (
    <div className="overflow-hidden bg-black/60 border-y border-white/10 py-2 cursor-pointer select-none">
      <div
        className="flex gap-10 whitespace-nowrap"
        style={{
          animation: 'marquee 40s linear infinite',
        }}
      >
        {doubled.map((token, i) => (
          <button
            key={`${token.address}-${i}`}
            onClick={() => router.push(`/trade?token=${token.address}`)}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            {token.logoURI && (
              <img
                src={token.logoURI}
                alt={token.symbol}
                className="w-5 h-5 rounded-full"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <span className="font-bold text-white text-sm">{token.symbol}</span>
            <span className="text-white/60 text-sm">
              ${token.price < 0.01
                ? token.price.toExponential(2)
                : token.price.toFixed(token.price < 1 ? 4 : 2)}
            </span>
            <span
              className={`text-sm font-medium ${
                token.priceChange24hPercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {token.priceChange24hPercent >= 0 ? '+' : ''}
              {token.priceChange24hPercent?.toFixed(2)}%
            </span>
          </button>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
```

---

### TradingView Chart (`components/trade/TokenChart.tsx`)

**Option 1 — TradingView Widget (simplest, no license needed):**

```tsx
'use client'
import { useEffect, useRef } from 'react'

interface Props {
  symbol?: string // e.g. "SOLUSDT"
}

export function TokenChart({ symbol = 'SOLUSDT' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: '15',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      hide_side_toolbar: true,
      allow_symbol_change: false,
      calendar: false,
    })

    const widgetContainer = document.createElement('div')
    widgetContainer.className = 'tradingview-widget-container__widget'
    widgetContainer.style.height = '100%'
    widgetContainer.style.width = '100%'

    containerRef.current.appendChild(widgetContainer)
    containerRef.current.appendChild(script)

    return () => { if (containerRef.current) containerRef.current.innerHTML = '' }
  }, [symbol])

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container w-full h-[400px]"
      style={{ height: '400px' }}
    />
  )
}
```

**Option 2 — BirdEye OHLCV + lightweight-charts (better for unknown tokens):**

```bash
npm install lightweight-charts
```

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { createChart, ColorType } from 'lightweight-charts'

interface OHLCVBar {
  o: number; h: number; l: number; c: number; unixTime: number; v: number
}

export function TokenChart({ address }: { address: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      layout: { background: { type: ColorType.Solid, color: '#0a0a0a' }, textColor: '#fff' },
      grid: { vertLines: { color: '#1a1a1a' }, horzLines: { color: '#1a1a1a' } },
      width: containerRef.current.clientWidth,
      height: 400,
    })

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
    })

    fetch(`/api/tokens/${address}/ohlcv`)
      .then(r => r.json())
      .then((bars: OHLCVBar[]) => {
        const formatted = bars.map(b => ({
          time: b.unixTime as any,
          open: b.o, high: b.h, low: b.l, close: b.c,
        }))
        candleSeries.setData(formatted)
        chart.timeScale().fitContent()
      })

    return () => chart.remove()
  }, [address])

  return <div ref={containerRef} className="w-full" />
}
```

**Use Option 1 for known Solana tokens that have TradingView symbols. Use Option 2 for obscure memecoins (which ChadWallet likely targets). Implement Option 2.**

---

### Live Trades Feed (`components/trade/LiveTrades.tsx`)

```tsx
'use client'
import { useEffect, useState } from 'react'

interface Trade {
  txHash: string
  side: 'buy' | 'sell'
  from: { symbol: string; amount: number }
  to: { symbol: string; amount: number }
  source: string
  blockTime: number
  owner: string
}

export function LiveTrades({ address }: { address: string }) {
  const [trades, setTrades] = useState<Trade[]>([])

  useEffect(() => {
    if (!address) return

    const fetchTrades = () => {
      fetch(`/api/tokens/${address}/trades`)
        .then(r => r.json())
        .then(d => setTrades(d.trades ?? []))
    }

    fetchTrades()
    const interval = setInterval(fetchTrades, 8000)
    return () => clearInterval(interval)
  }, [address])

  return (
    <div className="overflow-y-auto max-h-[300px]">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-[#0f0f0f]">
          <tr className="text-white/40">
            <th className="text-left py-1 px-2">Type</th>
            <th className="text-right py-1 px-2">Amount</th>
            <th className="text-right py-1 px-2">SOL</th>
            <th className="text-right py-1 px-2">Wallet</th>
            <th className="text-right py-1 px-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <tr key={t.txHash ?? i} className="border-b border-white/5 hover:bg-white/5">
              <td className={`py-1 px-2 font-bold ${t.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                {t.side?.toUpperCase()}
              </td>
              <td className="text-right py-1 px-2 text-white">
                {t.to?.amount?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </td>
              <td className="text-right py-1 px-2 text-white/60">
                {t.from?.amount?.toFixed(3)}
              </td>
              <td className="text-right py-1 px-2 text-white/40 font-mono">
                {t.owner ? `${t.owner.slice(0, 4)}...${t.owner.slice(-4)}` : '—'}
              </td>
              <td className="text-right py-1 px-2 text-white/40">
                {t.blockTime
                  ? new Date(t.blockTime * 1000).toLocaleTimeString()
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

### Trade Panel with Jupiter Quote (`components/trade/TradePanel.tsx`)

```tsx
'use client'
import { useState, useEffect } from 'react'
import { usePrivy, useSolanaWallets } from '@privy-io/react-auth'

interface Props {
  tokenAddress: string
  tokenSymbol: string
  tokenDecimals?: number
}

const SOL_MINT = 'So11111111111111111111111111111111111111112'
const LAMPORTS_PER_SOL = 1_000_000_000

export function TradePanel({ tokenAddress, tokenSymbol, tokenDecimals = 6 }: Props) {
  const { authenticated, login } = usePrivy()
  const { wallets } = useSolanaWallets()
  const wallet = wallets[0]

  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [quote, setQuote] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [solBalance, setSolBalance] = useState<number | null>(null)

  useEffect(() => {
    if (!wallet?.address) return
    fetch(`/api/balance?wallet=${wallet.address}`)
      .then(r => r.json())
      .then(d => setSolBalance(d.sol))
  }, [wallet?.address])

  const getQuote = async () => {
    if (!amount || isNaN(+amount)) return
    setLoading(true)
    try {
      const inputMint = side === 'buy' ? SOL_MINT : tokenAddress
      const outputMint = side === 'buy' ? tokenAddress : SOL_MINT
      const decimals = side === 'buy' ? 9 : tokenDecimals
      const amountLamports = Math.floor(+amount * Math.pow(10, decimals))

      const res = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountLamports}&slippageBps=100`
      )
      const data = await res.json()
      setQuote(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(getQuote, 600)
    return () => clearTimeout(t)
  }, [amount, side, tokenAddress])

  const outAmount = quote?.outAmount
    ? (Number(quote.outAmount) / Math.pow(10, side === 'buy' ? tokenDecimals : 9)).toFixed(6)
    : null

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <p className="text-white/60 text-sm text-center">Connect your wallet to trade</p>
        <button
          onClick={login}
          className="w-full py-3 bg-[#your_accent] text-black font-bold rounded-xl hover:opacity-90 transition"
        >
          Connect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Buy / Sell Tabs */}
      <div className="flex rounded-xl overflow-hidden border border-white/10">
        {(['buy', 'sell'] as const).map(s => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={`flex-1 py-2 font-bold text-sm transition-colors ${
              side === s
                ? s === 'buy' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                : 'bg-transparent text-white/40 hover:text-white'
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Balance */}
      {solBalance !== null && (
        <div className="flex justify-between text-xs text-white/40">
          <span>Balance</span>
          <span>{solBalance.toFixed(4)} SOL</span>
        </div>
      )}

      {/* Amount Input */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-white/40">You pay</span>
          <div className="flex gap-2">
            {[0.1, 0.5, 1].map(v => (
              <button
                key={v}
                onClick={() => setAmount(String(v))}
                className="text-xs text-white/40 hover:text-white border border-white/10 px-2 py-0.5 rounded"
              >
                {v} SOL
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-white text-xl outline-none"
          />
          <span className="text-white font-bold">{side === 'buy' ? 'SOL' : tokenSymbol}</span>
        </div>
      </div>

      {/* Quote Output */}
      {outAmount && (
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-white/40">You receive</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white text-xl">{outAmount}</span>
            <span className="text-white font-bold">{side === 'buy' ? tokenSymbol : 'SOL'}</span>
          </div>
          {quote?.priceImpactPct && (
            <div className="text-xs text-white/40 mt-1">
              Price impact: {(Number(quote.priceImpactPct) * 100).toFixed(2)}%
            </div>
          )}
        </div>
      )}

      {/* Swap Button */}
      <button
        disabled={!amount || loading}
        className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
          side === 'buy'
            ? 'bg-green-500 hover:bg-green-400 text-black'
            : 'bg-red-500 hover:bg-red-400 text-white'
        } disabled:opacity-40 disabled:cursor-not-allowed`}
        onClick={() => {
          // Jupiter swap execution would go here
          // For assessment: show quote confirmation modal
          alert(`Swap: ${amount} ${side === 'buy' ? 'SOL' : tokenSymbol} → ${outAmount} ${side === 'buy' ? tokenSymbol : 'SOL'}`)
        }}
      >
        {loading ? 'Getting quote...' : `${side === 'buy' ? 'Buy' : 'Sell'} ${tokenSymbol}`}
      </button>
    </div>
  )
}
```

---

### SOL Balance API (`app/api/balance/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

const connection = new Connection(process.env.NEXT_PUBLIC_ALCHEMY_RPC!)

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get('wallet')
  if (!wallet) return NextResponse.json({ error: 'Missing wallet' }, { status: 400 })

  try {
    const pk = new PublicKey(wallet)
    const lamports = await connection.getBalance(pk)
    return NextResponse.json({ sol: lamports / LAMPORTS_PER_SOL })
  } catch {
    return NextResponse.json({ sol: 0 })
  }
}
```

---

### Trading Page Layout (`app/trade/page.tsx`)

```tsx
'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { TokenList } from '@/components/trade/TokenList'
import { TokenInfo } from '@/components/trade/TokenInfo'
import { TokenChart } from '@/components/trade/TokenChart'
import { LiveTrades } from '@/components/trade/LiveTrades'
import { HoldersList } from '@/components/trade/HoldersList'
import { TradePanel } from '@/components/trade/TradePanel'

export default function TradePage() {
  const params = useSearchParams()
  const [selectedToken, setSelectedToken] = useState<{
    address: string; symbol: string; decimals: number
  } | null>(
    params.get('token')
      ? { address: params.get('token')!, symbol: '...', decimals: 6 }
      : null
  )

  return (
    <div className="flex h-[calc(100vh-56px)] bg-[#0a0a0a] text-white overflow-hidden">
      {/* Left Panel — Token List */}
      <div className="w-64 flex-shrink-0 border-r border-white/10 overflow-y-auto">
        <TokenList
          onSelect={(token) => setSelectedToken(token)}
          selectedAddress={selectedToken?.address}
        />
      </div>

      {/* Middle Panel — Chart + Info + Feeds */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {selectedToken ? (
          <>
            <TokenInfo address={selectedToken.address} onLoad={(t) => setSelectedToken(prev => ({ ...prev!, ...t }))} />
            <div className="flex-1 min-h-[400px]">
              <TokenChart address={selectedToken.address} />
            </div>
            <div className="grid grid-cols-2 border-t border-white/10">
              <div className="border-r border-white/10">
                <div className="px-4 py-2 text-xs text-white/40 border-b border-white/10">LIVE TRADES</div>
                <LiveTrades address={selectedToken.address} />
              </div>
              <div>
                <div className="px-4 py-2 text-xs text-white/40 border-b border-white/10">TOP HOLDERS</div>
                <HoldersList address={selectedToken.address} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/20">
            Select a token to start trading
          </div>
        )}
      </div>

      {/* Right Panel — Buy/Sell */}
      <div className="w-72 flex-shrink-0 border-l border-white/10 overflow-y-auto">
        {selectedToken ? (
          <TradePanel
            tokenAddress={selectedToken.address}
            tokenSymbol={selectedToken.symbol}
            tokenDecimals={selectedToken.decimals}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/20 text-sm">
            Select a token
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 8. Privy Apple OAuth Setup (Critical)

Apple OAuth requires extra steps that trip people up:

1. Go to developer.apple.com → Identifiers → App IDs → your app → enable "Sign in with Apple"
2. Create a Services ID (separate from App ID) → configure domain + redirect URLs
3. Redirect URL: `https://auth.privy.io/api/v1/oauth/callback` (check Privy docs for exact URL)
4. Add your live Vercel domain as authorized domain
5. In Privy dashboard → Auth Methods → Apple → paste your Services ID

**Test Apple login on Safari/iOS. Chrome on desktop may not support Apple login.**

---

## 9. Risk Areas + Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| TradingView charting library requires license agreement | Blocks chart | Use `lightweight-charts` (open source, same team) or TradingView widget embed |
| BirdEye API rate limits (free tier: ~100 req/min) | Broken data | Cache in Next.js API routes with `revalidate: 60`. Never call BirdEye from client. |
| Jupiter swap transaction fails on mainnet | Broken buy/sell | Show quote only, add "Swap (Demo)" label. The UI/quote is enough to pass. |
| Apple OAuth not working without Apple Dev account | Login fails | Document in submission: "Google login fully tested; Apple requires Apple Dev account for callback URL config" |
| BirdEye token logo URLs broken | Ugly UI | Always add `onError` on `<img>` to show a fallback gradient circle |
| Solana RPC timeout on Alchemy free tier | Slow balance fetch | Add 3-second timeout + fallback to 0. Never block the UI. |
| fomo.family down or changed | Can't reference | Archive it now via web.archive.org or screenshot it |

---

## 10. What Makes This Win vs. Just Pass

**Just pass:**
- Landing page exists, auth works, banner shows token names

**Win:**
- Landing page looks indistinguishable from a real crypto product
- Token banners show real logos, prices, color-coded change percentages
- Trading page loads real data within 1–2 seconds
- Connected wallet shows SOL balance in buy panel
- Live trades update in real-time
- Mobile view works (even if trading page collapses gracefully)
- Page title changes when a token is selected

**The one thing that separates a founding engineer from a contractor:** You don't just implement requirements. You make it feel like a real product. Spacing, loading states, empty states, hover interactions — these matter. Spend time on them on Day 6.

---

## 11. Supabase Usage (Optional but Smart)

You don't strictly need Supabase for this assessment. But if BirdEye rate limits become an issue, use Supabase as a lightweight cache:

```typescript
// Cache trending tokens in Supabase for 60 seconds
// so 100 users hitting your site don't trigger 100 BirdEye calls

import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function getCachedTrendingTokens() {
  const cacheKey = 'trending_tokens'
  const { data: cached } = await supabase
    .from('cache')
    .select('payload, updated_at')
    .eq('key', cacheKey)
    .single()

  const stale = !cached || Date.now() - new Date(cached.updated_at).getTime() > 60_000

  if (!stale) return JSON.parse(cached.payload)

  const fresh = await getTrendingTokens()
  await supabase.from('cache').upsert({ key: cacheKey, payload: JSON.stringify(fresh), updated_at: new Date().toISOString() })
  return fresh
}
```

Schema for Supabase (run in SQL editor):
```sql
create table cache (
  key text primary key,
  payload text not null,
  updated_at timestamptz not null default now()
);
```

Since Next.js API routes with `revalidate` handle caching at the edge, Supabase caching is only needed if you get rate-limited on BirdEye despite that.

---

## 12. Submission Message (Send This)

```
Hi [Name],

Live preview: https://your-app.vercel.app

What's included:
- Landing page styled like fomo.family with ChadWallet branding
- Rotating token banners (top + bottom) powered by BirdEye — real prices, logos, 24h change
- Sign in with Google via Privy (Apple login configured, requires Apple Dev callback URL for full test)
- Solana embedded wallet created on first login
- Clicking any banner token opens the trading page for that token
- Trading page: trending token list (left), token info + price chart + live trades + top holders (middle), buy/sell panel with Jupiter quotes (right)
- User's SOL balance displayed in buy panel when wallet connected
- Deployed on Vercel, data via BirdEye + Alchemy

The swap execution button shows the Jupiter quote but does not execute the transaction on mainnet — happy to wire that up if useful for the next round.

Let me know if you want me to walk through any part of it.
```

---

## 13. Quick Reference: API Signup Links

| Service | URL | What you need |
|---|---|---|
| Privy | https://privy.io | Create app, get App ID |
| BirdEye | https://bds.birdeye.so | Sign up, get API key |
| Alchemy | https://alchemy.com | Create Solana mainnet app, get RPC URL |
| Supabase | https://supabase.com | Create project, get URL + anon key |
| Vercel | https://vercel.com | Link GitHub repo |

All of these are free tier. Do Privy and BirdEye sign-up today before anything else.

---

## 14. Single Highest-Leverage Move

If you only have 3 days and not 6: ship the landing page with banners and auth, skip the trading page. The brief says it's explicitly OK not to do the trading page. A polished landing page that's visually on-par with fomo.family, with working real-data banners and working Privy login, will move you to the next round. The trading page is upside, not the floor.
