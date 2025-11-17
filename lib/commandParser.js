export const commandParser = {
  parse(input) {
    const text = input.trim().toLowerCase()
    
    // تشخیص دستورات فارسی
    if (text.includes('وضعیت کلی') || text.includes('سلامت سیستم') || text.includes('status')) {
      return { type: 'health', detail: 'full' }
    }
    
    if (text.includes('هشدار') || text.includes('alert') || text.includes('خطا')) {
      return { type: 'alerts' }
    }
    
    if (text.includes('کش') || text.includes('cache')) {
      const view = text.includes('تحلیل') ? 'analysis' : 
                  text.includes('بهینه') ? 'optimize' : 'status'
      return { type: 'cache', view }
    }
    
    if (text.includes('منابع') || text.includes('resource') || text.includes('مصرف')) {
      return { type: 'resources' }
    }
    
    if (text.includes('کارگر') || text.includes('worker')) {
      return { type: 'workers' }
    }
    
    if (text.includes('پاک') || text.includes('تمیز') || text.includes('cleanup')) {
      return { type: 'cleanup' }
    }
    
    // پیش‌فرض
    return { type: 'unknown' }
  }
}
