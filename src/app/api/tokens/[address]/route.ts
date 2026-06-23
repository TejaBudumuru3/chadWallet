import { getTokenOverview } from '@/lib/birdeye'
import { getCached } from '@/lib/cache'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params
  try {
    const overview = await getCached(
      `token_overview_${address}`,
      30_000, // 30 second TTL
      () => getTokenOverview(address)
    )
    return Response.json({ data: overview })
  } catch (err) {
    console.error('Token overview error:', err)
    return Response.json({ data: null, error: 'Failed to fetch' }, { status: 500 })
  }
}
