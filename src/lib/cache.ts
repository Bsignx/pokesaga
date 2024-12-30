// lib/cache.ts

const cache = new Map<string, { data: any; timestamp: number }>();

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

export function getCachedPrice(cardSlug: string): any | null {
  const cached = cache.get(cardSlug);

  if (cached) {
    const currentTime = Date.now();
    // Check if the cache is still valid (not expired)
    if (currentTime - cached.timestamp < CACHE_EXPIRATION_TIME) {
      return cached.data;
    } else {
      // Cache expired, remove it
      cache.delete(cardSlug);
    }
  }
  return null; // Return null if no valid cached price found
}

export function setCachedPrice(cardId: string, priceData: any): void {
  const currentTime = Date.now();
  cache.set(cardId, { data: priceData, timestamp: currentTime });
}
