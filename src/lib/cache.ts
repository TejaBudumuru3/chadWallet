import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

const memoryCache = new Map<string, { payload: unknown; updated_at: number }>()

/**
 * Cache-through helper: returns cached data if fresh, otherwise fetches and caches.
 * This protects BirdEye's 1 req/sec rate limit by serving multiple users from cache.
 */
export async function getCached<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now()

  // 1. Check local memory cache first (fastest, prevents spamming API if DB fails)
  const mem = memoryCache.get(key)
  if (mem && now - mem.updated_at < ttlMs) {
    return mem.payload as T
  }

  // 2. Check Supabase cache
  if (supabase) {
    try {
      const { data } = await supabase
        .from('api_cache')
        .select('payload, updated_at')
        .eq('key', key)
        .single()

      if (data && now - new Date(data.updated_at).getTime() < ttlMs) {
        // Hydrate memory cache too
        memoryCache.set(key, { payload: data.payload, updated_at: new Date(data.updated_at).getTime() })
        return data.payload as T
      }
    } catch {
      // Cache miss or table doesn't exist yet — proceed to fetch
    }
  }

  const fresh = await fetcher()

  // 3. Update memory cache
  memoryCache.set(key, { payload: fresh, updated_at: now })

  // 4. Update Supabase cache
  if (supabase) {
    try {
      await supabase.from('api_cache').upsert({
        key,
        payload: fresh as unknown as Record<string, unknown>,
        updated_at: new Date(now).toISOString(),
      })
    } catch {
      // Cache write failed — not critical, just return fresh data
    }
  }

  return fresh
}
