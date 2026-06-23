import { getTokenTrades } from '@/lib/birdeye'
import { getCached } from '@/lib/cache'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params
  try {
    const trades = await getCached(
      `token_trades_${address}`,
      10_000, // 10 second TTL — trades update fast
      () => getTokenTrades(address, 50)
    )
    return Response.json({ trades })
  } catch (err) {
    console.error('Token trades error:', err)
    return Response.json({ trades: [], error: 'Failed to fetch' }, { status: 500 })
  }
}
