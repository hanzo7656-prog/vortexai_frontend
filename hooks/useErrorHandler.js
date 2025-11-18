import { useCallback } from 'react';
import { useNotifications } from './useNotifications';

export function useErrorHandler() {
  const { showError } = useNotifications();

  const handleError = useCallback((error, context = '') => {
    console.error(`Error in ${context}:`, error);

    let userMessage = 'خطای ناشناخته ای رخ داده است';
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      userMessage = 'خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.';
    } else if (error.response) {
      // خطای HTTP
      switch (error.response.status) {
        case 400:
          userMessage = 'درخواست نامعتبر است';
          break;
        case 401:
          userMessage = 'دسترسی غیرمجاز';
          break;
        case 403:
          userMessage = 'شما مجوز انجام این عمل را ندارید';
          break;
        case 404:
          userMessage = 'منبع مورد نظر یافت نشد';
          break;
        case 429:
          userMessage = 'تعداد درخواست‌های شما بیش از حد مجاز است';
          break;
        case 500:
          userMessage = 'خطای داخلی سرور';
          break;
        case 503:
          userMessage = 'سرویس در دسترس نیست';
          break;
        default:
          userMessage = `خطای سرور: ${error.response.status}`;
      }
    } else if (error.request) {
      userMessage = 'پاسخی از سرور دریافت نشد';
    } else {
      userMessage = error.message || 'خطای ناشناخته';
    }

    showError(userMessage, `خطا ${context ? `در ${context}` : ''}`);

    // گزارش خطا به سرویس آنالیتیکس (در صورت وجود)
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        context
      });
    }

    return userMessage;
  }, [showError]);

  const handleAsyncError = useCallback(async (asyncFn, context = '') => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, context);
      throw error;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
}
