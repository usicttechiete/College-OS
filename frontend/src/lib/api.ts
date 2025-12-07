const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  code?: string;
  data?: T;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
}

/**
 * Make an API request to the backend
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
    };
  }
}

// Auth API
export const authApi = {
  signup: (data: {
    email: string;
    password: string;
    name: string;
    enrollment?: string;
    batch?: string;
    branch?: string;
    profilePic?: string;
  }) => request('/auth/signup', { method: 'POST', body: data }),

  login: (email: string, password: string) =>
    request<{
      user: {
        id: string;
        email: string;
        name: string;
        enrollment: string;
        batch: string;
        branch: string;
        profile_pic: string;
        trust_score: number;
        role: string;
      };
      session: {
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
        expiresIn: number;
      };
    }>('/auth/login', { method: 'POST', body: { email, password } }),

  logout: (token: string) =>
    request('/auth/logout', { method: 'POST', token }),

  refresh: (refreshToken: string) =>
    request<{
      session: {
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
        expiresIn: number;
      };
    }>('/auth/refresh', { method: 'POST', body: { refreshToken } }),

  getProfile: (token: string) =>
    request<{
      user: {
        id: string;
        email: string;
        name: string;
        enrollment: string;
        batch: string;
        branch: string;
        profile_pic: string;
        trust_score: number;
        role: string;
      };
    }>('/auth/me', { token }),

  updateProfile: (
    token: string,
    data: {
      name?: string;
      enrollment?: string;
      batch?: string;
      branch?: string;
      profilePic?: string;
    }
  ) => request('/auth/profile', { method: 'PATCH', token, body: data }),

  forgotPassword: (email: string) =>
    request('/auth/forgot-password', { method: 'POST', body: { email } }),
};

export default request;
