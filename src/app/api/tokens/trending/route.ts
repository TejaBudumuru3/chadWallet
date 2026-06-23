import { getTrendingTokens } from '@/lib/birdeye'
import { getCached } from '@/lib/cache'

export async function GET() {
  try {
    const tokens = await getCached(
      'trending_tokens',
      60_000, // 60 second TTL
      () => getTrendingTokens(30)
    )
    return Response.json({ tokens })
  } catch (err) {
    console.error('Trending tokens error:', err)
    return Response.json({ tokens: [], error: 'Failed to fetch' }, { status: 500 })
  }
}
