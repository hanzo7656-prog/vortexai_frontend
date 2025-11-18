export default function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="message-avatar">
        🧠
      </div>
      <div className="typing-content">
        <div className="typing-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <span className="typing-text">VortexAI در حال تایپ...</span>
      </div>

      <style jsx>{`
        .typing-indicator {
          display: flex;
          margin-bottom: 24px;
          animation: fadeIn 0.3s ease-in;
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
          margin-left: 12px;
          background: linear-gradient(135deg, #4facfe, #00f2fe);
        }

        .typing-content {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #a0aec0;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }

        .typing-text {
          font-size: 14px;
          color: #718096;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
