export const APP_CONFIG = {
  name: 'VortexAI',
  version: '1.0.0',
  description: 'دستیار هوشمند تحلیل بازار کریپتوکارنسی',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
    retryAttempts: 3
  },
  features: {
    realTimeChat: true,
    voiceMessages: false,
    fileSharing: false,
    multiLanguage: true
  },
  limits: {
    maxMessageLength: 4000,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxSessionsPerUser: 20,
    messageHistoryLimit: 100
  }
};

export const CHAT_CONSTANTS = {
  MESSAGE_TYPES: {
    TEXT: 'text',
    IMAGE: 'image',
    FILE: 'file',
    SYSTEM: 'system'
  },
  USER_ROLES: {
    USER: 'user',
    ASSISTANT: 'assistant',
    SYSTEM: 'system'
  },
  SESSION_STATUS: {
    ACTIVE: 'active',
    ARCHIVED: 'archived',
    DELETED: 'deleted'
  }
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.',
  SERVER_ERROR: 'خطای سرور. لطفاً稍后 دوباره تلاش کنید.',
  MESSAGE_SEND_FAILED: 'ارسال پیام ناموفق بود. لطفاً دوباره تلاش کنید.',
  SESSION_LOAD_FAILED: 'بارگذاری مکالمه ناموفق بود.',
  UNAUTHORIZED: 'دسترسی غیرمجاز. لطفاً وارد شوید.'
};

export const SUCCESS_MESSAGES = {
  MESSAGE_SENT: 'پیام با موفقیت ارسال شد.',
  SESSION_CREATED: 'مکالمه جدید ایجاد شد.',
  SESSION_DELETED: 'مکالمه حذف شد.'
};

export const THEME = {
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    info: '#4299e1',
    dark: '#2d3748',
    light: '#f7fafc'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    success: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    dark: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)'
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 25px rgba(0,0,0,0.1)',
    xl: '0 20px 40px rgba(0,0,0,0.1)'
  }
};
