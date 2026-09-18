import api from '@/lib/axios';
import { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth.types';

// Centralized Token / Storage Helper
export const tokenStorage = {
  getAccessToken: (): string | null => {
    return typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  },
  getRefreshToken: (): string | null => {
    return typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  },
  setAccessToken: (token: string): void => {
    if (typeof window !== 'undefined') localStorage.setItem('accessToken', token);
  },
  saveAuthData: (data: AuthResponse): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  },
  clearAuthData: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
};

// Singleton promise to prevent concurrent refresh calls
let refreshPromise: Promise<string> | null = null;

// API Services
export const loginUser = async (credentials: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials);
  tokenStorage.saveAuthData(data);
  return data;
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  tokenStorage.saveAuthData(data);
  return data;
};

export const refreshToken = async (): Promise<string> => {
  // If a refresh is already in progress, reuse the same promise
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const currentRefreshToken = tokenStorage.getRefreshToken();
      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      const { data } = await api.post<{ accessToken: string }>('/auth/refresh', {
        refreshToken: currentRefreshToken,
      });

      console.log('Token refreshed successfully:', data.accessToken);
      tokenStorage.setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (error) {
      tokenStorage.clearAuthData();
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const logoutUser = async (): Promise<void> => {
  const currentRefreshToken = tokenStorage.getRefreshToken();
  try {
    if (currentRefreshToken) {
      await api.post('/auth/logout', { refreshToken: currentRefreshToken });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    tokenStorage.clearAuthData();
  }
};

/**
 * Authenticated Fetch Wrapper
 * Attaches token, catches 401s, refreshes token, and retries the request once.
 */
export const authenticatedFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const token = tokenStorage.getAccessToken();
  const headers = new Headers(init?.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    try {
      // Refresh the token
      const newToken = await refreshToken();

      // Retry original request with the fresh token
      headers.set('Authorization', `Bearer ${newToken}`);
      response = await fetch(input, { ...init, headers });
    } catch {
      // If refresh fails, return the initial 401 response
      return response;
    }
  }

  return response;
};