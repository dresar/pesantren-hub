/**
 * SimpleCache — In-Memory Cache untuk Development & Edge Cases
 *
 * ⚠️  PENTING untuk Serverless:
 * Cache ini HANYA efektif dalam satu invocation atau jika function instance
 * di-reuse (warm instance). Di Vercel Serverless, cache ini akan:
 *   - Berfungsi jika instance yang sama mendapat request berikutnya (warm)
 *   - Kosong kembali saat cold start atau instance baru dibuat
 *
 * Untuk caching yang persistent di serverless, gunakan:
 *   - Vercel KV (Redis-based)
 *   - Upstash Redis
 *   - Response Cache Headers (Cache-Control) untuk endpoint GET publik
 *
 * Cache ini tetap berguna untuk:
 *   - Mengurangi DB hits dalam satu request lifecycle
 *   - Development lokal
 *   - Warm instance optimization
 */
type CacheEntry = { value: unknown; expiresAt: number };

class SimpleCache {
  private store = new Map<string, CacheEntry>();

  get<T = unknown>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  set(key: string, value: unknown, ttlMs = 60_000): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  del(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  /** Jumlah entry aktif di cache */
  size(): number {
    return this.store.size;
  }
}

export const cache = new SimpleCache();