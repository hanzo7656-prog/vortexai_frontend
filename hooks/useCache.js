import { useCallback, useRef } from 'react';

export function useCache() {
  const cacheRef = useRef(new Map());

  const get = useCallback((key) => {
    const item = cacheRef.current.get(key);
    
    if (item && item.expiry > Date.now()) {
      return item.value;
    }
    
    // حذف آیتم منقضی شده
    if (item) {
      cacheRef.current.delete(key);
    }
    
    return null;
  }, []);

  const set = useCallback((key, value, ttl = 5 * 60 * 1000) => { // 5 minutes default
    const item = {
      value,
      expiry: Date.now() + ttl
    };
    
    cacheRef.current.set(key, item);
  }, []);

  const remove = useCallback((key) => {
    cacheRef.current.delete(key);
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const clearExpired = useCallback(() => {
    const now = Date.now();
    for (const [key, item] of cacheRef.current.entries()) {
      if (item.expiry <= now) {
        cacheRef.current.delete(key);
      }
    }
  }, []);

  const getStats = useCallback(() => {
    clearExpired();
    
    return {
      size: cacheRef.current.size,
      keys: Array.from(cacheRef.current.keys())
    };
  }, [clearExpired]);

  // پاک‌سازی خودکار آیتم‌های منقضی شده
  const startCleanupInterval = useCallback((interval = 60 * 1000) => {
    return setInterval(clearExpired, interval);
  }, [clearExpired]);

  return {
    get,
    set,
    remove,
    clear,
    getStats,
    startCleanupInterval
  };
}
