interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class Cache {
  private storage: Map<string, CacheItem<any>> = new Map()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.storage.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })

    // Also store in localStorage for persistence
    try {
      localStorage.setItem(
        `cache_${key}`,
        JSON.stringify({
          data,
          timestamp: Date.now(),
          ttl,
        }),
      )
    } catch (error) {
      console.warn("Failed to store in localStorage:", error)
    }
  }

  get<T>(key: string): T | null {
    // First check memory cache
    const memoryItem = this.storage.get(key)
    if (memoryItem && this.isValid(memoryItem)) {
      return memoryItem.data
    }

    // Then check localStorage
    try {
      const stored = localStorage.getItem(`cache_${key}`)
      if (stored) {
        const item: CacheItem<T> = JSON.parse(stored)
        if (this.isValid(item)) {
          // Restore to memory cache
          this.storage.set(key, item)
          return item.data
        } else {
          // Remove expired item
          localStorage.removeItem(`cache_${key}`)
        }
      }
    } catch (error) {
      console.warn("Failed to read from localStorage:", error)
    }

    return null
  }

  private isValid(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp < item.ttl
  }

  invalidate(key: string): void {
    this.storage.delete(key)
    try {
      localStorage.removeItem(`cache_${key}`)
    } catch (error) {
      console.warn("Failed to remove from localStorage:", error)
    }
  }

  clear(): void {
    this.storage.clear()
    try {
      // Remove all cache items from localStorage
      const keys = Object.keys(localStorage).filter((key) => key.startsWith("cache_"))
      keys.forEach((key) => localStorage.removeItem(key))
    } catch (error) {
      console.warn("Failed to clear localStorage cache:", error)
    }
  }
}

export const cache = new Cache()

// Helper function for cached API calls
export async function cachedFetch<T>(key: string, fetchFn: () => Promise<T>, ttl?: number): Promise<T> {
  // Try to get from cache first
  const cached = cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // Fetch fresh data
  const data = await fetchFn()

  // Store in cache
  cache.set(key, data, ttl)

  return data
}
