import { useState, useEffect } from 'react'
import Head from 'next/head'
import { healthAPI } from '../lib/api'

export default function Dashboard() {
  const [systemData, setSystemData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 30000) // هر 30 ثانیه آپدیت
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      const [status, metrics, cache] = await Promise.all([
        healthAPI.getStatus('basic'),
        healthAPI.getMetrics('system'),
        healthAPI.getCacheStatus('basic')
      ])
      
      setSystemData({
        status: status.data,
        metrics: metrics.data,
        cache: cache.data
      })
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#10b981'
      case 'degraded': return '#f59e0b'
      case 'down': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy': return 'سالم'
      case 'degraded': return 'مشکل جزئی'
      case 'down': return 'مشکل'
      default: return 'نامشخص'
    }
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <Head>
          <title>داشبورد سیستم - VortexAI</title>
        </Head>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>در حال بارگذاری وضعیت سیستم...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <Head>
        <title>داشبورد سیستم - VortexAI</title>
      </Head>

      <header className="page-header">
        <div className="header-content">
          <h1>داشبورد سیستم</h1>
          <p>وضعیت لحظه‌ای سرویس‌ها و منابع</p>
        </div>
        <div className="header-actions">
          <button onClick={loadDashboardData} className="refresh-btn">
            بروزرسانی
          </button>
          {lastUpdate && (
            <span className="last-update">
              آخرین بروزرسانی: {lastUpdate.toLocaleTimeString('fa-IR')}
            </span>
          )}
        </div>
      </header>

      <div className="dashboard-content">
        {/* کارت وضعیت کلی */}
        <div className="status-card main-status">
          <div className="status-header">
            <h3>وضعیت کلی سیستم</h3>
            <div 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(systemData?.status?.overall) }}
            >
              {getStatusText(systemData?.status?.overall)}
            </div>
          </div>
          
          <div className="status-grid">
            <div className="status-item">
              <span className="status-label">API Endpoints</span>
              <span className="status-value">
                {systemData?.status?.services?.api_endpoints || 'نامشخص'}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">سیستم کش</span>
              <span className="status-value">
                {systemData?.status?.services?.cache_system || 'نامشخص'}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">دیتابیس</span>
              <span className="status-value">
                {systemData?.status?.services?.database || 'نامشخص'}
              </span>
            </div>
          </div>
        </div>

        {/* متریک‌های عملکرد */}
        <div className="metrics-grid">
          <div className="metric-card">
            <h4>درخواست‌های API</h4>
            <div className="metric-value">
              {systemData?.metrics?.requests?.total || 0}
            </div>
            <div className="metric-label">تعداد کل</div>
          </div>
          
          <div className="metric-card">
            <h4>میانگین پاسخ</h4>
            <div className="metric-value">
              {systemData?.metrics?.performance?.response_time_avg || 0}ms
            </div>
            <div className="metric-label">زمان پاسخ</div>
          </div>
          
          <div className="metric-card">
            <h4>اتصالات فعال</h4>
            <div className="metric-value">
              {systemData?.metrics?.connections?.active || 0}
            </div>
            <div className="metric-label">تعداد اتصال</div>
          </div>
        </div>

        {/* وضعیت کش */}
        <div className="cache-card">
          <h3>وضعیت سیستم کش</h3>
          <div className="cache-stats">
            <div className="cache-stat">
              <span>Hit Rate:</span>
              <span>{systemData?.cache?.hit_rate || 0}%</span>
            </div>
            <div className="cache-stat">
              <span>حجم کش:</span>
              <span>{systemData?.cache?.size || 0}</span>
            </div>
            <div className="cache-stat">
              <span>کلیدهای فعال:</span>
              <span>{systemData?.cache?.keys || 0}</span>
            </div>
          </div>
        </div>

        {/* راهنمای وضعیت */}
        <div className="status-guide">
          <h4>راهنمای وضعیت‌ها:</h4>
          <div className="guide-items">
            <div className="guide-item">
              <div className="status-dot healthy"></div>
              <span>سالم - همه چیز نرمال است</span>
            </div>
            <div className="guide-item">
              <div className="status-dot warning"></div>
              <span>مشکل جزئی - برخی سرویس‌ها کند هستند</span>
            </div>
            <div className="guide-item">
              <div className="status-dot critical"></div>
              <span>مشکل - نیاز به توجه فوری</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
