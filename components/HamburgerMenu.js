import { useEffect } from 'react'

export default function HamburgerMenu({ isOpen, onClose, activeTab, onTabChange }) {
  // بستن منو با کلیک خارج از آن
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.hamburger-menu') && !event.target.closest('.hamburger-btn')) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // غیرفعال کردن اسکرول وقتی منو باز است
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
    
    return () => document.body.classList.remove('menu-open')
  }, [isOpen])

  const menuItems = [
    { id: 'chat', label: 'گفتگو', icon: '💬' },
    { id: 'dashboard', label: 'داشبورد سیستم', icon: '📊' },
    { id: 'debug', label: 'ابزارهای دیباگ', icon: '🔧' },
    { id: 'coins', label: 'نمادهای ارز', icon: '💰' },
    { id: 'news', label: 'اخبار بازار', icon: '📰' },
    { id: 'insights', label: 'تحلیل بازار', icon: '🔮' },
    { id: 'exchanges', label: 'صرافی‌ها', icon: '🏦' }
  ]

  const handleMenuItemClick = (tabId) => {
    if (tabId === 'coins' || tabId === 'news' || tabId === 'insights' || tabId === 'exchanges') {
      // هدایت به صفحات جداگانه
      window.location.href = `/${tabId}`
    } else {
      // تغییر تب در صفحه اصلی
      onTabChange(tabId)
    }
  }

  return (
    <>
      {/* overlay */}
      {isOpen && <div className="menu-overlay" onClick={onClose}></div>}
      
      {/* منو */}
      <nav className={`hamburger-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h2 className="menu-title">منوی VortexAI</h2>
          <button className="close-menu-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="menu-items">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleMenuItemClick(item.id)}
            >
              <span className="menu-item-icon">{item.icon}</span>
              <span className="menu-item-label">{item.label}</span>
              {activeTab === item.id && (
                <span className="active-indicator"></span>
              )}
            </button>
          ))}
        </div>
        
        <div className="menu-footer">
          <div className="user-info">
            <div className="user-avatar">V</div>
            <div className="user-details">
              <span className="user-name">کاربر VortexAI</span>
              <span className="user-status">آنلاین</span>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
        }
        
        .hamburger-menu {
          position: fixed;
          top: 0;
          left: -300px;
          width: 300px;
          height: 100%;
          background: white;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          z-index: 999;
          transition: left 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        
        .hamburger-menu.open {
          left: 0;
        }
        
        .menu-header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
        }
        
        .menu-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        
        .close-menu-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .menu-items {
          flex: 1;
          padding: 10px 0;
          overflow-y: auto;
        }
        
        .menu-item {
          width: 100%;
          padding: 15px 20px;
          background: none;
          border: none;
          text-align: right;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: background-color 0.2s;
          position: relative;
        }
        
        .menu-item:hover {
          background-color: #f3f4f6;
        }
        
        .menu-item.active {
          background-color: #eff6ff;
          color: #2563eb;
        }
        
        .menu-item-icon {
          font-size: 18px;
        }
        
        .menu-item-label {
          font-size: 16px;
          font-weight: 500;
        }
        
        .active-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 20px;
          background: #2563eb;
          border-radius: 0 2px 2px 0;
        }
        
        .menu-footer {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          background: #f8fafc;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        
        .user-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        
        .user-name {
          font-weight: 600;
          color: #1f2937;
        }
        
        .user-status {
          font-size: 12px;
          color: #10b981;
        }
        
        @media (max-width: 768px) {
          .hamburger-menu {
            width: 280px;
            left: -280px;
          }
        }
      `}</style>
    </>
  )
}
