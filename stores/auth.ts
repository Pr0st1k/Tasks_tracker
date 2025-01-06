import { defineStore } from 'pinia';

interface TokenContent {
    accessToken: string;
    valid: boolean;
    userId: number;
    role: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
      accessToken: null as string | null,
      valid: null as boolean | null,
      userId: null as number | null,
      role: null as string | null,
    }),
    actions: {
      setAuthData(token: string, userId: number, role: string) {
        this.accessToken = token;
        this.userId = userId;
        this.role = role;
        localStorage.setItem('accessToken', token);
      },
      clearAuthData() {
        this.accessToken = null;
        this.userId = null;
        this.role = null;
        localStorage.removeItem('accessToken');
      },
      async validateToken() {
        if (!this.accessToken) {
          return { valid: false, userId: null, role: null };
        }
      
        try {
          const { valid, userId, role } : TokenContent = await $fetch('/api/token/validate-token', {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          });
      
          if (valid) {
            this.userId = userId;
            this.role = role;
            return { valid: true, userId, role };
          } else {
            this.clearAuthData();
            return { valid: false, userId: null, role: null };
          }
        } catch (error) {
          this.clearAuthData();
          return { valid: false, userId: null, role: null };
        }
      },
    },
    persist: {
        key: 'auth-store'
    },
  });