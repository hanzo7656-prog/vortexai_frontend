import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-render-app.onrender.com';

export function useChat(userId, initialSessionId = null) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(initialSessionId);

  // بارگذاری تاریخچه چت
  const loadChatHistory = useCallback(async (sessionId) => {
    if (!sessionId) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/history?session_id=${sessionId}&limit=50`);
      const data = await response.json();
      
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      loadChatHistory(sessionId);
    }
  }, [sessionId, loadChatHistory]);

  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          user_id: userId,
          session_id: sessionId
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.response,
          timestamp: data.timestamp,
          metadata: data.metadata
        };

        setMessages(prev => [...prev, aiMessage]);
        setSessionId(data.session_id);
        
        return data;
      } else {
        throw new Error(data.detail || 'خطا در ارسال پیام');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'متأسفانه در ارتباط با سرور مشکلی پیش آمده. لطفاً دوباره تلاش کنید.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [userId, sessionId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSessionId(null);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    sessionId,
    clearMessages
  };
}
