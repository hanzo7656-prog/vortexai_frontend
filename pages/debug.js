import { useState } from 'react'
import Head from 'next/head'
import DebugPanel from '../components/DebugPanel'

export default function DebugPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', name: '📊 نمای کلی', icon: '📊' },
    { id: 'performance', name: '⚡ عملکرد', icon: '⚡' },
    { id: 'alerts', name: '🚨 هشدارها', icon: '🚨' },
    { id: 'cache', name: '💾 کش', icon: '💾' },
    { id: 'workers', name: '⚙️ کارگران', icon: '⚙️' }
  ]

  return (
    <div className="debug-container">
      <Head>
        <title>ابزارهای دیباگ - VortexAI</title>
      </Head>

      <header className="page-header">
        <h1>🔧 ابزارهای دیباگ و مانیتورینگ</h1>
        <p>مدیریت پیشرفته سیستم و عیب‌یابی</p>
      </header>

      <nav className="debug-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </nav>

      <main className="debug-content">
        <DebugPanel view={activeTab} />
      </main>
    </div>
  )
}
