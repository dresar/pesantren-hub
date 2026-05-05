"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
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
    set(key, value, ttlMs = 60_000) {
        this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
    }
    del(key) {
        this.store.delete(key);
    }
    clear() {
        this.store.clear();
    }
    /** Jumlah entry aktif di cache */
    size() {
        return this.store.size;
    }
}
exports.cache = new SimpleCache();
