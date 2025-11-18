import { useState, useEffect } from 'react';

export default function Footer() {
  const [systemStatus, setSystemStatus] = useState('checking');
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    // بررسی وضعیت سیستم
    const checkSystemStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health/status?detail=basic`);
        const data = await response.json();
        setSystemStatus(data.status === 'healthy' ? 'online' : 'degraded');
        
        // شبیه‌سازی تعداد کاربران آنلاین
        setOnlineUsers(Math.floor(Math.random() * 50) + 10);
      } catch (error) {
        setSystemStatus('offline');
      }
    };

    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 30000); // هر 30 ثانیه

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'online': return '#48bb78';
      case 'degraded': return '#ed8936';
      case 'offline': return '#f56565';
      default: return '#a0aec0';
    }
  };

  const getStatusText = () => {
    switch (systemStatus) {
      case 'online': return 'آنلاین';
      case 'degraded': return 'مشکل موقت';
      case 'offline': return 'آفلاین';
      default: return 'در حال بررسی...';
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="status-indicator">
            <div 
              className="status-dot" 
              style={{ backgroundColor: getStatusColor() }}
            ></div>
            <span>وضعیت سیستم: {getStatusText()}</span>
          </div>
        </div>

        <div className="footer-section">
          <span className="online-users">
            👥 {onlineUsers} کاربر آنلاین
          </span>
        </div>

        <div className="footer-section">
          <div className="footer-links">
            <button className="footer-link">راهنما</button>
            <button className="footer-link">قوانین</button>
            <button className="footer-link">گزارش مشکل</button>
          </div>
        </div>

        <div className="footer-section">
          <span className="copyright">
            © 2024 VortexAI v1.0.0
          </span>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: #2d3748;
          color: white;
          padding: 16px 24px;
          border-top: 1px solid #4a5568;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .online-users {
          font-size: 14px;
          color: #e2e8f0;
        }

        .footer-links {
          display: flex;
          gap: 20px;
        }

        .footer-link {
          background: none;
          border: none;
          color: #a0aec0;
          cursor: pointer;
          font-size: 14px;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: white;
        }

        .copyright {
          font-size: 14px;
          color: #a0aec0;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }
          
          .footer-links {
            gap: 16px;
          }
        }
      `}</style>
    </footer>
  );
}
