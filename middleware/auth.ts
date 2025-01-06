import { useAuthStore } from '~/stores/auth';
import { watch } from 'vue';
import { storeToRefs } from 'pinia';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  if (typeof window !== 'undefined') {
    const { accessToken } = storeToRefs(authStore);

    if (!accessToken) {
      authStore.clearAuthData();
    }

    const { valid, userId, role } = await authStore.validateToken();

    if (!valid && to.path !== '/Auth') {
      return navigateTo('/Auth');
    }

    if (valid && (to.path === '/Auth' || to.path === '/auth')) {
      return navigateTo('/');
    }
  }
});