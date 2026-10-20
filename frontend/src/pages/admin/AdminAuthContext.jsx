import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { request, setCsrfToken, postJson } from '../../api';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [state, setState] = useState({ loading: true, authenticated: false, username: null });

  const refresh = useCallback(async () => {
    const data = await request('/admin/me');
    if (data.csrf_token) setCsrfToken(data.csrf_token);
    setState({ loading: false, authenticated: data.authenticated, username: data.username || null });
    return data.authenticated;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (username, password) => {
      const data = await postJson('/admin/login', { username, password });
      if (data.csrf_token) setCsrfToken(data.csrf_token);
      setState({ loading: false, authenticated: true, username });
      return data;
    },
    []
  );

  const logout = useCallback(async () => {
    await postJson('/admin/logout', {});
    setState({ loading: false, authenticated: false, username: null });
  }, []);

  return <AdminAuthContext.Provider value={{ ...state, login, logout, refresh }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
