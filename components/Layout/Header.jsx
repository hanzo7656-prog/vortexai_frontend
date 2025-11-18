import { useState } from 'react';

export default function Header({ user, onToggleSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onToggleSidebar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        
        <div className="logo">
          <div className="logo-icon">🧠</div>
          <span className="logo-text">VortexAI</span>
        </div>
      </div>

      <div className="header-center">
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span>دستیار هوشمند کریپتو</span>
        </div>
      </div>

      <div className="header-right">
        <div className="user-menu">
          <button 
            className="user-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="user-avatar">
              {user.name.charAt(0)}
            </div>
            <span className="user-name">{user.name}</span>
          </button>

          {isMenuOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20" stroke="currentColor" strokeWidth="2"/>
                </svg>
                پروفایل
              </div>
              <div className="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99038 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99038 10.0492 5.45193 10.3246 4.31731Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                تنظیمات
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item text-danger">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 12H9" stroke="currentColor" strokeWidth="2"/>
                </svg>
                خروج
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .menu-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #4a5568;
          transition: background 0.2s;
        }

        .menu-btn:hover {
          background: #f7fafc;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 18px;
          color: #2d3748;
        }

        .logo-icon {
          font-size: 24px;
        }

        .header-center {
          display: flex;
          align-items: center;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f0fff4;
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid #9ae6b4;
          color: #276749;
          font-size: 14px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #48bb78;
          animation: pulse 2s infinite;
        }

        .header-right {
          position: relative;
        }

        .user-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .user-btn:hover {
          background: #f7fafc;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .user-name {
          font-size: 14px;
          color: #2d3748;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          padding: 8px;
          margin-top: 8px;
          z-index: 1000;
          min-width: 200px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 14px;
          color: #4a5568;
        }

        .dropdown-item:hover {
          background: #f7fafc;
        }

        .dropdown-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 4px 0;
        }

        .text-danger {
          color: #e53e3e;
        }

        .text-danger:hover {
          background: #fed7d7;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .header {
            padding: 12px 16px;
          }
          
          .logo-text {
            display: none;
          }
          
          .status-indicator span {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
