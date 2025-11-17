import { useState, useEffect } from 'react'
import { healthAPI } from '../lib/api'

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMetrics()
    const interval = setInterval(loadMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadMetrics = async () => {
    try {
      const data = await healthAPI.getMetrics('all')
      setMetrics(data)
    } catch (error) {
      console.error('Error loading metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">📊</div>
        <p>در حال بارگذاری متریک‌ها...</p>
      </div>
    )
  }

  return (
    <div className="monitoring-dashboard">
      <div className="dashboard-header">
        <h3>📊 مانیتورینگ پیشرفته</h3>
        <button onClick={loadMetrics} className="refresh-btn">
          🔄
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">💻</div>
          <div className="metric-content">
            <div className="metric-title">CPU</div>
            <div className="metric-value">
              {metrics?.system?.cpu?.usage_percent || 0}%
            </div>
            <div className="metric-desc">
              {metrics?.system?.cpu?.cores || 0} هسته
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🧠</div>
          <div className="metric-content">
            <div className="metric-title">حافظه</div>
            <div className="metric-value">
              {metrics?.system?.memory?.usage_percent || 0}%
            </div>
            <div className="metric-desc">
              {Math.round((metrics?.system?.memory?.used_mb || 0) / 1024)} GB
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💾</div>
          <div className="metric-content">
            <div className="metric-title">دیسک</div>
            <div className="metric-value">
              {metrics?.system?.disk?.usage_percent || 0}%
            </div>
            <div className="metric-desc">
              {metrics?.system?.disk?.used_gb || 0} GB
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-title">پاسخ</div>
            <div className="metric-value">
              {metrics?.timestamp ? '🟢' : '🔴'}
            </div>
            <div className="metric-desc">
              {new Date().toLocaleTimeString('fa-IR')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
