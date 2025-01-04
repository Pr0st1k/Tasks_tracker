import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      document.cookie = 'auth-store=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      authStore.clearAuthData();
    }

    const isValid = await authStore.validateToken();

    if (!isValid && to.path !== '/Auth') {
      return navigateTo('/Auth');
    }

    if (isValid && (to.path === '/Auth' || to.path === '/auth')) {
      return navigateTo('/');
    }
  }
});