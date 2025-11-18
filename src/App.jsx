import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import ChatContainer from './components/ChatContainer'
import { checkBackendHealth } from './services/api'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState('checking')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // بررسی وضعیت بک‌اند در هنگام لود
    checkBackendHealth()
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('disconnected'))
  }, [])

  return (
    <div className="app">
      <Header 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        backendStatus={backendStatus}
      />
      
      <div className="app-body">
        <ChatContainer backendStatus={backendStatus} />
      </div>
    </div>
  )
}

export default App
