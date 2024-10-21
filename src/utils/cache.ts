/**
 * 注册缓存服务
 */
export const registryCacheService = () => {
  const { serviceWorker } = navigator;
  if (!serviceWorker) {
    console.warn('your browser not support serviceWorker');
    return;
  }
  window.addEventListener('load', async () => {
    navigator.serviceWorker.register('/cache-service.js').then(
      (registration) => {
        // Registration was successful
        console.log('SW registered ', registration.scope);
      },
      (err) => {
        // Registration failed
        console.log('SW registration failed ', err);
      },
    );
  });
};
