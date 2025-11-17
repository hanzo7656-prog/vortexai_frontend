import { useState, useEffect } from 'react'
import { healthAPI } from '../lib/api'

export default function ResourceMonitor({ data }) {
  const [metrics, setMetrics] = useState(data?.resources || {})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (data?.resources) {
      setMetrics(data.resources)
    }
  }, [data])

  const refreshMetrics = async () => {
    setIsLoading(true)
    try {
      const newMetrics = await healthAPI.getMetrics('system')
      setMetrics(newMetrics)
    } catch (error) {
      console.error('Error refreshing metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const ProgressBar = ({ value, label, color = 'blue' }) => (
    <div className="progress-item">
      <div className="progress-label">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className={`progress-fill ${color}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  )

  return (
    <div className="resource-monitor">
      <div className="monitor-header">
        <h3>⚡ مانیتور منابع</h3>
        <button 
          onClick={refreshMetrics}
          disabled={isLoading}
          className="refresh-button"
        >
          {isLoading ? '⏳' : '🔄'}
        </button>
      </div>

      <div className="resources-grid">
        <div className="resource-section">
          <h4>💻 پردازنده (CPU)</h4>
          <ProgressBar 
            value={metrics.cpu?.usage_percent || 0} 
            label="مصرف CPU"
            color={metrics.cpu?.usage_percent > 80 ? 'red' : 'blue'}
          />
          <div className="resource-details">
            <span>هسته‌ها: {metrics.cpu?.cores || 0}</span>
            <span>میانگین بار: {metrics.cpu?.load_average?.[0]?.toFixed(2) || 0}</span>
          </div>
        </div>

        <div className="resource-section">
          <h4>🧠 حافظه (RAM)</h4>
          <ProgressBar 
            value={metrics.memory?.usage_percent || 0}
            label="مصرف حافظه"
            color={metrics.memory?.usage_percent > 80 ? 'red' : 'green'}
          />
          <div className="resource-details">
            <span>مصرف شده: {(metrics.memory?.used_mb / 1024).toFixed(1)} GB</span>
            <span>کل: {(metrics.memory?.total_mb / 1024).toFixed(1)} GB</span>
          </div>
        </div>

        <div className="resource-section">
          <h4>💾 دیسک</h4>
          <ProgressBar 
            value={metrics.disk?.usage_percent || 0}
            label="مصرف دیسک"
            color={metrics.disk?.usage_percent > 90 ? 'red' : 'purple'}
          />
          <div className="resource-details">
            <span>مصرف شده: {metrics.disk?.used_gb} GB</span>
            <span>کل: {metrics.disk?.total_gb} GB</span>
          </div>
        </div>
      </div>

      {/* اطلاعات Render */}
      {metrics.render_limits && (
        <div className="render-info">
          <h4>🎯 محدودیت‌های Render</h4>
          <div className="limits-grid">
            <div className="limit-item">
              <span>RAM: {metrics.render_limits.ram_mb} MB</span>
              <span>مصرف: {metrics.memory?.render_usage_percent?.toFixed(1)}%</span>
            </div>
            <div className="limit-item">
              <span>Disk: {metrics.render_limits.disk_gb} GB</span>
              <span>مصرف: {metrics.disk?.render_usage_percent?.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
