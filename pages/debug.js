import { useState } from 'react'
import Head from 'next/head'
import { healthAPI } from '../lib/api'

export default function DebugPage() {
  const [activeTab, setActiveTab] = useState('logs')
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const tabs = [
    { id: 'logs', name: 'لاگ‌های سیستم' },
    { id: 'tests', name: 'تست APIها' },
    { id: 'cache', name: 'مدیریت کش' }
  ]

  const loadLogs = async () => {
    setIsLoading(true)
    try {
      // این endpoint باید در بک‌اند تعریف شود
      const response = await healthAPI.getAlerts()
      setLogs(response.data || [])
    } catch (error) {
      console.error('Error loading logs:', error)
      setLogs([{ message: 'خطا در بارگذاری لاگ‌ها', level: 'error' }])
    } finally {
      setIsLoading(false)
    }
  }

  const runAPITest = async () => {
    setIsLoading(true)
    setTestResult(null)
    
    try {
      const tests = [
        { name: 'سلامت سیستم', api: () => healthAPI.getStatus('basic') },
        { name: 'وضعیت کش', api: () => healthAPI.getCacheStatus('basic') },
        { name: 'متریک‌ها', api: () => healthAPI.getMetrics('system') }
      ]

      const results = []
      for (const test of tests) {
        try {
          const startTime = Date.now()
          await test.api()
          const responseTime = Date.now() - startTime
          results.push({
            name: test.name,
            status: 'success',
            responseTime: responseTime
          })
        } catch (error) {
          results.push({
            name: test.name,
            status: 'error',
            error: error.message
          })
        }
      }

      setTestResult(results)
    } catch (error) {
      console.error('Error running tests:', error)
      setTestResult([{ name: 'خطا کلی', status: 'error', error: error.message }])
    } finally {
      setIsLoading(false)
    }
  }

  const clearCache = async () => {
    if (!confirm('آیا از پاک‌سازی کش مطمئن هستید؟')) return
    
    setIsLoading(true)
    try {
      await healthAPI.runCleanup()
      alert('کش با موفقیت پاک شد')
    } catch (error) {
      console.error('Error clearing cache:', error)
      alert('خطا در پاک‌سازی کش')
    } finally {
      setIsLoading(false)
    }
  }

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error': return '#ef4444'
      case 'warning': return '#f59e0b'
      case 'info': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  return (
    <div className="page-container">
      <Head>
        <title>ابزارهای دیباگ - VortexAI</title>
      </Head>

      <header className="page-header">
        <div className="header-content">
          <h1>ابزارهای دیباگ</h1>
          <p>ابزارهای پیشرفته برای توسعه و عیب‌یابی</p>
        </div>
      </header>

      <nav className="debug-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </nav>

      <div className="debug-content">
        {/* تب لاگ‌ها */}
        {activeTab === 'logs' && (
          <div className="tab-content">
            <div className="tab-header">
              <h3>لاگ‌های سیستم</h3>
              <button onClick={loadLogs} className="action-btn" disabled={isLoading}>
                {isLoading ? 'در حال بارگذاری...' : 'بارگذاری لاگ‌ها'}
              </button>
            </div>
            
            <div className="logs-container">
              {logs.length > 0 ? (
                <div className="logs-list">
                  {logs.map((log, index) => (
                    <div key={index} className="log-entry">
                      <div 
                        className="log-level"
                        style={{ backgroundColor: getLogLevelColor(log.level) }}
                      >
                        {log.level}
                      </div>
                      <div className="log-message">{log.message}</div>
                      {log.timestamp && (
                        <div className="log-time">
                          {new Date(log.timestamp).toLocaleString('fa-IR')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>هیچ لاگی برای نمایش وجود ندارد</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* تب تست APIها */}
        {activeTab === 'tests' && (
          <div className="tab-content">
            <div className="tab-header">
              <h3>تست سلامت APIها</h3>
              <button onClick={runAPITest} className="action-btn" disabled={isLoading}>
                {isLoading ? 'در حال تست...' : 'اجرای تست‌ها'}
              </button>
            </div>
            
            {testResult && (
              <div className="test-results">
                <h4>نتایج تست:</h4>
                {testResult.map((result, index) => (
                  <div key={index} className={`test-result ${result.status}`}>
                    <span className="test-name">{result.name}</span>
                    <span className={`test-status ${result.status}`}>
                      {result.status === 'success' ? '✅ موفق' : '❌ خطا'}
                    </span>
                    {result.responseTime && (
                      <span className="test-time">{result.responseTime}ms</span>
                    )}
                    {result.error && (
                      <span className="test-error">{result.error}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* تب مدیریت کش */}
        {activeTab === 'cache' && (
          <div className="tab-content">
            <div className="tab-header">
              <h3>مدیریت سیستم کش</h3>
            </div>
            
            <div className="cache-actions">
              <div className="action-card">
                <h4>پاک‌سازی کش</h4>
                <p>تمام داده‌های کش شده پاک خواهند شد</p>
                <button 
                  onClick={clearCache} 
                  className="danger-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'در حال پاک‌سازی...' : 'پاک‌سازی کش'}
                </button>
              </div>
              
              <div className="action-card">
                <h4>اطلاعات کش</h4>
                <p>مشاهده آمار و وضعیت کش</p>
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="secondary-btn"
                >
                  مشاهده در داشبورد
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
