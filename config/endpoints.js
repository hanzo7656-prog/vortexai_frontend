export const ENDPOINTS = {
  health: {
    base: '/api/health',
    endpoints: {
      ping: '/ping',
      status: '/status',
      debug: '/debug',
      cache: '/cache',
      metrics: '/metrics',
      workers: '/workers',
      cleanup: '/cleanup',
      monitoring: '/monitoring'
    }
  },
  coins: {
    base: '/api/coins',
    endpoints: {
      list: '/list',
      details: '/details',
      charts: '/charts'
    }
  },
  news: {
    base: '/api/news',
    endpoints: {
      all: '/all',
      byType: '/type',
      sources: '/sources',
      detail: '/detail'
    }
  },
  insights: {
    base: '/api/insights',
    endpoints: {
      fearGreed: '/fear-greed',
      btcDominance: '/btc-dominance',
      rainbowChart: '/rainbow-chart'
    }
  }
}

export const QUICK_LINKS = {
  healthCheck: '/api/health/status?detail=basic',
  cacheStatus: '/api/health/cache?view=status',
  debugOverview: '/api/health/debug?view=overview',
  allMetrics: '/api/health/metrics?type=all'
}
