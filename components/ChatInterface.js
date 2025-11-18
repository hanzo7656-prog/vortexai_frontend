// components/ChatInterface.js
import { useState, useRef, useEffect } from 'react'

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: '🤖 سلام! من دستیار هوشمند VortexAI هستم. می‌تونم وضعیت سیستم، قیمت ارزها، اخبار و اطلاعات فنی رو بهتون گزارش بدم.',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [systemStatus, setSystemStatus] = useState(null)
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedUserId = localStorage.getItem('vortexai_user_id')
      if (savedUserId) return savedUserId
      
      const newUserId = 'user_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('vortexai_user_id', newUserId)
      return newUserId
    }
    return 'user_default'
  })
  
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadChatHistory()
    checkSystemHealth()
  }, [])

  // بررسی سلامت سیستم
  const checkSystemHealth = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-test-3gix.onrender.com'
      
      const response = await fetch(
        `${API_URL}/api/ai/chat/health`
      )
      
      if (response.ok) {
        const healthData = await response.json()
        setSystemStatus(healthData)
        
        if (!healthData.ai_available) {
          const healthMessage = {
            id: Date.now(),
            type: 'system',
            content: '⚠️ سیستم هوش مصنوعی در حال حاضر در دسترس نیست. برخی قابلیت‌ها محدود هستند.',
            timestamp: new Date(),
            isWarning: true
          }
          setMessages(prev => [healthMessage, ...prev])
        }
      }
    } catch (error) {
      console.log('بررسی سلامت سیستم انجام نشد:', error.message)
    }
  }

  const loadChatHistory = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-test-3gix.onrender.com'
      
      // دریافت سشن‌های کاربر
      const sessionsResponse = await fetch(
        `${API_URL}/api/ai/chat/sessions?user_id=${userId}&limit=1`
      )
      
      if (!sessionsResponse.ok) {
        throw new Error('خطا در دریافت سشن‌ها')
      }
      
      const sessionsData = await sessionsResponse.json()
      
      if (sessionsData.sessions && sessionsData.sessions.length > 0) {
        const latestSession = sessionsData.sessions[0]
        setCurrentSessionId(latestSession.session_id)
        
        // دریافت تاریخچه سشن
        const historyResponse = await fetch(
          `${API_URL}/api/ai/chat/history?session_id=${latestSession.session_id}&limit=20`
        )
        
        if (historyResponse.ok) {
          const historyData = await historyResponse.json()
          
          if (historyData.messages && historyData.messages.length > 0) {
            const historyMessages = historyData.messages.map(msg => ({
              id: `${msg.timestamp}_${msg.role}`,
              type: msg.role === 'user' ? 'user' : 'system',
              content: msg.content,
              timestamp: new Date(msg.timestamp),
              success: msg.metadata?.success,
              command: msg.metadata?.intent,
              confidence: msg.metadata?.confidence,
              responseTime: msg.metadata?.response_time
            }))
            
            setMessages(prev => [...historyMessages])
          }
        }
      }
    } catch (error) {
      console.log('بارگذاری تاریخچه انجام نشد:', error.message)
    }
  }

  // دریافت پیشنهادات سوال
  const loadSuggestions = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-test-3gix.onrender.com'
      
      const response = await fetch(
        `${API_URL}/api/ai/chat/suggestions?user_id=${userId}`
      )
      
      if (response.ok) {
        const suggestionsData = await response.json()
        return suggestionsData.suggestions || []
      }
    } catch (error) {
      console.log('دریافت پیشنهادات انجام نشد:', error.message)
    }
    return []
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-test-3gix.onrender.com'
      
      const response = await fetch(
        `${API_URL}/api/ai/chat/send`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: inputMessage,
            user_id: userId,
            session_id: currentSessionId
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `خطای سرور: ${response.status}`)
      }

      const botResponse = await response.json()

      // ذخیره session_id برای استفاده در ادامه
      if (botResponse.session_id && !currentSessionId) {
        setCurrentSessionId(botResponse.session_id)
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'system',
        content: botResponse.response || "❌ پاسخی دریافت نشد",
        timestamp: new Date(),
        success: botResponse.success,
        command: botResponse.metadata?.intent,
        confidence: botResponse.metadata?.confidence,
        responseTime: botResponse.response_time
      }

      setMessages(prev => [...prev, botMessage])

    } catch (error) {
      console.error('خطا در ارسال پیام:', error)
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'system',
        content: `⚠️ خطا در ارتباط: ${error.message}`,
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChatHistory = async () => {
    if (currentSessionId) {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-test-3gix.onrender.com'
        await fetch(
          `${API_URL}/api/ai/chat/sessions/${currentSessionId}`,
          { method: 'DELETE' }
        )
      } catch (error) {
        console.log('خطا در حذف سشن از سرور:', error)
      }
    }

    setMessages([
      {
        id: Date.now(),
        type: 'system', 
        content: '🧹 تاریخچه گفتگو پاک شد. چطور می‌تونم کمک کنم؟',
        timestamp: new Date()
      }
    ])
    setCurrentSessionId(null)
  }

  const refreshSystemStatus = async () => {
    await checkSystemHealth()
    
    const statusMessage = {
      id: Date.now(),
      type: 'system',
      content: '🔄 وضعیت سیستم به‌روزرسانی شد',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, statusMessage])
  }

  const formatMessageContent = (content) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  const getStatusColor = (confidence) => {
    if (!confidence) return 'var(--text-secondary)'
    if (confidence > 0.8) return '#10b981'
    if (confidence > 0.5) return '#f59e0b'
    return '#ef4444'
  }

  const getSystemStatusColor = () => {
    if (!systemStatus) return '#6b7280'
    if (systemStatus.ai_available && systemStatus.ai_initialized) return '#10b981'
    if (systemStatus.ai_available) return '#f59e0b'
    return '#ef4444'
  }

  const getSystemStatusText = () => {
    if (!systemStatus) return 'در حال بررسی...'
    if (systemStatus.ai_available && systemStatus.ai_initialized) return 'فعال'
    if (systemStatus.ai_available) return 'محدود'
    return 'غیرفعال'
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-title">
          <div className="bot-avatar">🤖</div>
          <div>
            <h3>دستیار VortexAI</h3>
            <div className="status-container">
              <span 
                className="status-dot" 
                style={{ backgroundColor: getSystemStatusColor() }}
              ></span>
              <span className="status-text">{getSystemStatusText()}</span>
              {systemStatus && (
                <span className="status-info">
                  • {systemStatus.active_sessions} سشن • {systemStatus.total_users} کاربر
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button 
            onClick={refreshSystemStatus}
            className="refresh-button"
            title="بررسی وضعیت سیستم"
            disabled={isLoading}
          >
            🔄
          </button>
          <button 
            onClick={clearChatHistory}
            className="clear-button"
            title="پاک کردن تاریخچه"
            disabled={isLoading}
          >
            {isLoading ? '⏳' : '🗑️'}
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.type} ${message.isError ? 'error' : ''} ${message.isWarning ? 'warning' : ''}`}>
            <div className="message-avatar">
              {message.type === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-text">
                {formatMessageContent(message.content)}
              </div>
              <div className="message-meta">
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString('fa-IR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                
                {message.responseTime && (
                  <span className="message-response-time">
                    • {message.responseTime}ثانیه
                  </span>
                )}
                
                {message.command && (
                  <span className="message-command">
                    • {message.command}
                  </span>
                )}
                
                {message.confidence && (
                  <span 
                    className="message-confidence"
                    style={{ color: getStatusColor(message.confidence) }}
                  >
                    • اطمینان: {Math.round(message.confidence * 100)}%
                  </span>
                )}
                
                {message.isError && (
                  <span className="message-error-flag">
                    • خطا
                  </span>
                )}
                
                {message.isWarning && (
                  <span className="message-warning-flag">
                    • هشدار
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message system">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span>در حال پردازش</span>
                <div className="typing-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="input-wrapper">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="سوال خود را بپرسید... (مثال: وضعیت سیستم، قیمت بیتکوین، مصرف منابع)"
            rows="1"
            className="chat-input"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              '📤'
            )}
          </button>
        </div>
        
        <div className="input-hint">
          ⏎ Enter برای ارسال • ⇧ Shift + Enter برای خط جدید
          {systemStatus && !systemStatus.ai_available && (
            <span className="ai-warning"> • هوش مصنوعی غیرفعال</span>
          )}
        </div>
      </div>
    </div>
  )
}
