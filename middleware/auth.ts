import Swal from "sweetalert2";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken && to.path !== "/Auth") {
      return navigateTo('/Auth');
    } 

    if (accessToken) {
      const { valid } = await $fetch('/api/token/validate-token', {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
        }
      }) as { valid: boolean; userId?: number; role?: string };

      if (!valid) {
        localStorage.removeItem('accessToken');
        if (to.path !== "/Auth") {
          return navigateTo('/Auth');
        }
      }
    }
  }
});