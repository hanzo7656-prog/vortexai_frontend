import { createContext, useContext, useReducer, useEffect } from 'react';

const AppStateContext = createContext();

const initialState = {
  user: null,
  currentSession: null,
  sessions: [],
  systemStatus: 'checking',
  theme: 'light',
  notifications: [],
  isSidebarOpen: true
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSession: action.payload };
    
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    
    case 'SET_SYSTEM_STATUS':
      return { ...state, systemStatus: action.payload };
    
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, action.payload].slice(-5) 
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    
    case 'ADD_MESSAGE_TO_SESSION':
      const { sessionId, message } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.session_id === sessionId
            ? {
                ...session,
                messages: [...(session.messages || []), message],
                message_count: (session.message_count || 0) + 1,
                last_activity: new Date().toISOString()
              }
            : session
        )
      };
    
    default:
      return state;
  }
}

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // بارگذاری وضعیت از localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('vortexai_app_state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'SET_USER', payload: parsedState.user });
        dispatch({ type: 'SET_THEME', payload: parsedState.theme });
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // ذخیره وضعیت در localStorage
  useEffect(() => {
    const stateToSave = {
      user: state.user,
      theme: state.theme
    };
    localStorage.setItem('vortexai_app_state', JSON.stringify(stateToSave));
  }, [state.user, state.theme]);

  const actions = {
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    setCurrentSession: (session) => dispatch({ type: 'SET_CURRENT_SESSION', payload: session }),
    setSessions: (sessions) => dispatch({ type: 'SET_SESSIONS', payload: sessions }),
    setSystemStatus: (status) => dispatch({ type: 'SET_SYSTEM_STATUS', payload: status }),
    setTheme: (theme) => dispatch({ type: 'SET_THEME', payload: theme }),
    addNotification: (notification) => dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    removeNotification: (id) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    addMessageToSession: (sessionId, message) => 
      dispatch({ type: 'ADD_MESSAGE_TO_SESSION', payload: { sessionId, message } })
  };

  return (
    <AppStateContext.Provider value={{ state, actions }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
