const BASE_URL = 'https://public-api.birdeye.so'
const HEADERS = {
  'X-API-KEY': process.env.BIRDEYE_API_KEY!,
  'x-chain': 'solana',
}

export async function getTrendingTokens(limit = 20) {
  const res = await fetch(
    `${BASE_URL}/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=${limit}`,
    { headers: HEADERS }
  )
  if (!res.ok) throw new Error(`BirdEye trending: ${res.status}`)
  const data = await res.json()
  return data.data?.tokens ?? []
}

export async function getTokenOverview(address: string) {
  const res = await fetch(
    `${BASE_URL}/defi/token_overview?address=${address}`,
    { headers: HEADERS }
  )
  if (!res.ok) throw new Error(`BirdEye overview: ${res.status}`)
  const data = await res.json()
  return data.data
}

export async function getTokenTrades(address: string, limit = 50) {
  const res = await fetch(
    `${BASE_URL}/defi/txs/token?address=${address}&tx_type=swap&limit=${limit}`,
    { headers: HEADERS }
  )
  if (!res.ok) throw new Error(`BirdEye trades: ${res.status}`)
  const data = await res.json()
  return data.data?.items ?? []
}

export async function getTokenOHLCV(address: string, tf = '15m') {
  const now = Math.floor(Date.now() / 1000)
  const from = now - 86400 // 24 hours
  const res = await fetch(
    `${BASE_URL}/defi/ohlcv?address=${address}&type=${tf}&time_from=${from}&time_to=${now}`,
    { headers: HEADERS }
  )
  if (!res.ok) throw new Error(`BirdEye OHLCV: ${res.status}`)
  const data = await res.json()
  return data.data?.items ?? []
}
