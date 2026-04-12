type CacheEntry = { value: any; expiresAt: number };
class SimpleCache {
  private store = new Map<string, CacheEntry>();
  get<T = any>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }
  set(key: string, value: any, ttlMs = 60000) {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
  del(key: string) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}
export const cache = new SimpleCache();