import React from 'react'
import MessageBubble from './MessageBubble'

const MessageList = ({ messages, loading }) => {
  if (messages.length === 0) {
    return (
      <div className="empty-chat">
        <div className="empty-icon">🌀</div>
        <h2>به VortexAI خوش آمدید</h2>
        <p>دستیار هوشمند تحلیل بازار کریپتو</p>
        <p className="empty-subtitle">سوال خود را بپرسید یا از پیشنهادات زیر استفاده کنید</p>
      </div>
    )
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {loading && (
        <div className="loading-message">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageList
