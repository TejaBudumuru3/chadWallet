import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Cache-through helper: returns cached data if fresh, otherwise fetches and caches.
 * This protects BirdEye's 1 req/sec rate limit by serving multiple users from cache.
 */
export async function getCached<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    const { data } = await supabase
      .from('api_cache')
      .select('payload, updated_at')
      .eq('key', key)
      .single()

    if (data && Date.now() - new Date(data.updated_at).getTime() < ttlMs) {
      return data.payload as T
    }
  } catch {
    // Cache miss or table doesn't exist yet — proceed to fetch
  }

  const fresh = await fetcher()

  try {
    await supabase.from('api_cache').upsert({
      key,
      payload: fresh as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    })
  } catch {
    // Cache write failed — not critical, just return fresh data
  }

  return fresh
}
