import { useEffect, useState } from 'react';

export default function Notification({ notification, onClose }) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (notification.duration > 0) {
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(onClose, 300);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '💡';
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success': return '#f0fff4';
      case 'error': return '#fed7d7';
      case 'warning': return '#fffaf0';
      case 'info': return '#ebf8ff';
      default: return '#f7fafc';
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success': return '#9ae6b4';
      case 'error': return '#feb2b2';
      case 'warning': return '#fbd38d';
      case 'info': return '#90cdf4';
      default: return '#e2e8f0';
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'success': return '#276749';
      case 'error': return '#c53030';
      case 'warning': return '#744210';
      case 'info': return '#2c5aa0';
      default: return '#4a5568';
    }
  };

  return (
    <div className={`notification ${isLeaving ? 'leaving' : ''}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {getIcon()}
        </div>
        
        <div className="notification-body">
          {notification.title && (
            <div className="notification-title">
              {notification.title}
            </div>
          )}
          <div className="notification-message">
            {notification.message}
          </div>
        </div>

        <button className="notification-close" onClick={handleClose}>
          ✕
        </button>
      </div>

      <style jsx>{`
        .notification {
          background: ${getBackgroundColor()};
          border: 1px solid ${getBorderColor()};
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateX(0);
          opacity: 1;
          transition: all 0.3s ease;
          max-width: 400px;
        }

        .notification.leaving {
          transform: translateX(100%);
          opacity: 0;
        }

        .notification-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .notification-icon {
          font-size: 18px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .notification-body {
          flex: 1;
          color: ${getTextColor()};
        }

        .notification-title {
          font-weight: 600;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .notification-message {
          font-size: 14px;
          line-height: 1.4;
        }

        .notification-close {
          background: none;
          border: none;
          color: ${getTextColor()};
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          font-size: 16px;
          opacity: 0.7;
          transition: opacity 0.2s;
          flex-shrink: 0;
        }

        .notification-close:hover {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .notification {
            max-width: 100%;
            margin: 8px 16px;
          }
        }
      `}</style>
    </div>
  );
}
