class SimpleCache {
    store = new Map();
    get(key) {
        const entry = this.store.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return entry.value;
    }
    set(key, value, ttlMs = 60000) {
        this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
    }
    del(key) {
        this.store.delete(key);
    }
    clear() {
        this.store.clear();
    }
}
export const cache = new SimpleCache();
