import { useState } from 'react';

export default function Message({ message }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const isUser = message.role === 'user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'} ${message.isError ? 'error-message' : ''}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🧠'}
      </div>
      
      <div className="message-content">
        <div className="message-text">
          {message.content}
        </div>
        
        {message.metadata && (
          <div className="message-metadata">
            {message.metadata.responseTime && (
              <span className="response-time">
                {message.metadata.responseTime} ثانیه
              </span>
            )}
            {message.metadata.confidence && (
              <span className="confidence">
                اطمینان: {Math.round(message.metadata.confidence * 100)}%
              </span>
            )}
          </div>
        )}
        
        <div className="message-footer">
          <span className="timestamp">{timestamp}</span>
          {!isUser && (
            <button 
              className={`copy-btn ${isCopied ? 'copied' : ''}`}
              onClick={copyToClipboard}
              title="کپی پیام"
            >
              {isCopied ? '✅' : '📋'}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .message {
          display: flex;
          margin-bottom: 24px;
          animation: fadeIn 0.3s ease-in;
        }

        .user-message {
          flex-direction: row-reverse;
        }

        .ai-message {
          flex-direction: row;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          margin: 0 12px;
        }

        .user-message .message-avatar {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .ai-message .message-avatar {
          background: linear-gradient(135deg, #4facfe, #00f2fe);
        }

        .message-content {
          max-width: 70%;
          background: white;
          border-radius: 18px;
          padding: 16px 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: relative;
        }

        .user-message .message-content {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .ai-message .message-content {
          background: white;
          border: 1px solid #e2e8f0;
        }

        .error-message .message-content {
          background: #fed7d7;
          border-color: #feb2b2;
          color: #c53030;
        }

        .message-text {
          line-height: 1.6;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .message-metadata {
          display: flex;
          gap: 12px;
          margin-top: 8px;
          font-size: 12px;
          opacity: 0.7;
        }

        .message-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          font-size: 12px;
          opacity: 0.7;
        }

        .copy-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .copy-btn:hover {
          background: rgba(0,0,0,0.1);
        }

        .copied {
          color: #48bb78;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .message-content {
            max-width: 85%;
          }
        }
      `}</style>
    </div>
  );
}
