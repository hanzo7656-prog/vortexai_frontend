import React, { useState, useEffect, useRef } from 'react'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import Suggestions from './Suggestions'
import { sendChatMessage, getChatSuggestions } from '../services/api'

const ChatContainer = ({ backendStatus }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadSuggestions()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadSuggestions = async () => {
    try {
      const data = await getChatSuggestions()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error('Failed to load suggestions:', error)
    }
  }

  const handleSendMessage = async (message) => {
    if (!message.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      const response = await sendChatMessage(message, 'user', sessionId)
      
      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.response,
          timestamp: new Date().toISOString(),
          metadata: response.metadata
        }
        
        setMessages(prev => [...prev, aiMessage])
        setSessionId(response.session_id)
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'متاسفانه در ارتباط با سرور مشکلی پیش آمده. لطفاً دوباره تلاش کنید.',
        timestamp: new Date().toISOString(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <MessageList messages={messages} loading={loading} />
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 0 && (
        <Suggestions 
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
        />
      )}

      <ChatInput 
        onSendMessage={handleSendMessage}
        loading={loading}
        disabled={backendStatus !== 'connected'}
      />
    </div>
  )
}

export default ChatContainer
