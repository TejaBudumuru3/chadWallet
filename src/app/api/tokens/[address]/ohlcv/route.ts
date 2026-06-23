import { getTokenOHLCV } from '@/lib/birdeye'
import { getCached } from '@/lib/cache'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params
  try {
    const ohlcv = await getCached(
      `token_ohlcv_${address}`,
      30_000, // 30 second TTL
      () => getTokenOHLCV(address, '15m')
    )
    return Response.json({ data: ohlcv })
  } catch (err) {
    console.error('Token OHLCV error:', err)
    return Response.json({ data: [], error: 'Failed to fetch' }, { status: 500 })
  }
}
