export default function CacheStatus({ data }) {
  if (!data) return null

  const cacheHealth = data.health || {}
  const dbStatus = cacheHealth.database_status || {}

  return (
    <div className="cache-panel">
      <div className="panel-header">
        <h3>💾 وضعیت سیستم کش</h3>
        <span className={`status-badge ${cacheHealth.status}`}>
          {cacheHealth.status === 'healthy' ? 'سالم' : 'مشکل'}
        </span>
      </div>

      <div className="cache-stats">
        <div className="stat-row">
          <span>امتیاز سلامت:</span>
          <span className="stat-value">{cacheHealth.health_score}%</span>
        </div>
        <div className="stat-row">
          <span>دیتابیس‌های متصل:</span>
          <span className="stat-value">
            {cacheHealth.cloud_resources?.databases_connected || 0}/5
          </span>
        </div>
        <div className="stat-row">
          <span>حافظه مصرفی:</span>
          <span className="stat-value">
            {cacheHealth.cloud_resources?.storage_used_mb || 0} MB
          </span>
        </div>
      </div>

      <div className="databases-grid">
        {Object.entries(dbStatus).map(([dbName, dbInfo]) => (
          <div key={dbName} className={`db-card ${dbInfo.connected ? 'connected' : 'disconnected'}`}>
            <div className="db-name">{dbName}</div>
            <div className="db-status">
              {dbInfo.connected ? '🟢 متصل' : '🔴 قطع'}
            </div>
            <div className="db-usage">
              {dbInfo.used_mb || 0} MB
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
