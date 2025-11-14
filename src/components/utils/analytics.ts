export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, params);
  }
};

export const trackPageView = (path: string) => {
  trackEvent('page_view', {
    page_path: path,
    page_title: document.title
  });
};