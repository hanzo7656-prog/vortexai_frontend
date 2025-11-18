import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAppState } from '../hooks/useAppState';
import { usePerformance } from '../hooks/usePerformance';
import ChatContainer from '../components/Chat/ChatContainer';
import Sidebar from '../components/UI/Sidebar';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

export default function Home() {
  const { state, actions } = useAppState();
  const { mark, trackResource } = usePerformance();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    mark('page_loaded');
    
    // مقداردهی اولیه کاربر
    const initializeUser = () => {
      const userId = `user_${Date.now()}`;
      actions.setUser({
        id: userId,
        name: 'کاربر VortexAI',
        avatar: `👤`
      });
      
      mark('user_initialized');
      setIsInitialized(true);
    };

    initializeUser();

    // بارگذاری سشن‌های کاربر
    const loadSessions = async () => {
      const endTracking = trackResource('/api/chat/sessions', 'sessions_load');
      
      try {
        const userId = state.user?.id || `user_${Date.now()}`;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/sessions?user_id=${userId}&limit=10`
        );
        const data = await response.json();
        
        if (data.sessions) {
          actions.setSessions(data.sessions);
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        endTracking();
      }
    };

    if (isInitialized) {
      loadSessions();
    }
  }, [isInitialized, actions, state.user, mark, trackResource]);

  if (!isInitialized) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-logo">🧠</div>
          <h1>VortexAI</h1>
          <p>در حال راه‌اندازی...</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Head>
        <title>VortexAI - دستیار هوشمند کریپتو</title>
        <meta name="description" content="دستیار هوشمند تحلیل بازار کریپتوکارنسی" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="main-layout">
        <Sidebar 
          isOpen={state.isSidebarOpen}
          currentSession={state.currentSession}
          user={state.user}
          onNewSession={() => actions.setCurrentSession(null)}
          onToggle={actions.toggleSidebar}
        />
        
        <div className="chat-area">
          <Header 
            user={state.user}
            onToggleSidebar={actions.toggleSidebar}
          />
          
          <ChatContainer
            session={state.currentSession}
            user={state.user}
            onSessionUpdate={actions.setCurrentSession}
          />
          
          <Footer />
        </div>
      </div>

      <style jsx>{`
        .app-container {
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .main-layout {
          display: flex;
          width: 100%;
          height: 100%;
          background: var(--bg-primary);
          border-radius: 20px;
          margin: 10px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
        }

        .loading-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .loading-content {
          text-align: center;
          animation: fadeIn 0.5s ease-in;
        }

        .loading-logo {
          font-size: 80px;
          margin-bottom: 20px;
          animation: bounce 2s infinite;
        }

        .loading-content h1 {
          font-size: 32px;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .loading-content p {
          font-size: 16px;
          margin-bottom: 20px;
          opacity: 0.8;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255,255,255,0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .main-layout {
            margin: 0;
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
}
