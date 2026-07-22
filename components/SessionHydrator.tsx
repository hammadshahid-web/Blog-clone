'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/stores/use-auth-store';

export default function SessionHydrator({ children }: { children: React.ReactNode }) {
  const { setAuth, clearAuth, setHydrated } = useAuthStore();

  useEffect(() => {
    async function restoreSession() {
      try {
        const { data } = await axios.post('/api/auth/refresh');
        setAuth(data.user, data.accessToken);
      } catch (error) {
        clearAuth();
      } finally {
        setHydrated(true);
      }
    }

    restoreSession();
  }, [setAuth, clearAuth, setHydrated]);

  return <>{children}</>;
}