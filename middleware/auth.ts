export default defineNuxtRouteMiddleware((to, from) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (!token && to.path !== "/Auth") {
      return navigateTo('/Auth');
    } 

    if(token && to.path === "/Auth") {
      return navigateTo('/')
    }
  }
});