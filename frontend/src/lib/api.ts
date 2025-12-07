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
  params?: Record<string, string | number | undefined>;
}

/**
 * Make an API request to the backend
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { method = 'GET', body, token, params } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Build URL with query parameters
  let url = `${API_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  try {
    const response = await fetch(url, {
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

// Found Items API
export interface FoundItemFormData {
  title: string;
  category: string;
  description: string;
  location: string;
  foundAt: string; // ISO 8601
  submissionType: 'keep-with-me' | 'submit-to-desk';
  imageUrls?: string[];
  verificationNotes?: string;
}

export interface FoundItemsQueryParams {
  status?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
  sortBy?: 'foundAt' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface FoundItem {
  id: string;
  finderId: string;
  title: string;
  category: string;
  description: string;
  location: string;
  foundAt: string;
  submissionType: 'keep-with-me' | 'submit-to-desk';
  imageUrls: string[];
  status: 'available' | 'matched' | 'returned' | 'verification-pending';
  finder: {
    id: string;
    name: string;
    avatarUrl: string;
    trustScore: number;
    isTrustedHelper: boolean;
  };
  verification: {
    verified: boolean;
    notes?: string | null;
    matchConfidence: number;
  };
  claimedBy?: string | null;
  claimedAt?: string | null;
  returnedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const foundApi = {
  // Create a new found item
  create: (token: string, data: FoundItemFormData) =>
    request<{ item: FoundItem }>('/found', { method: 'POST', token, body: data }),

  // Get all found items with filters
  getAll: (token: string | null, params?: FoundItemsQueryParams) =>
    request<{ items: FoundItem[]; pagination: Pagination }>('/found', { token, params }),

  // Get a specific found item
  getById: (token: string | null, id: string) =>
    request<{ item: FoundItem }>(`/found/${id}`, { token }),

  // Update a found item
  update: (token: string, id: string, data: Partial<FoundItemFormData>) =>
    request<{ item: FoundItem }>(`/found/${id}`, { method: 'PATCH', token, body: data }),

  // Delete a found item
  delete: (token: string, id: string) =>
    request(`/found/${id}`, { method: 'DELETE', token }),

  // Get current user's found items
  getMyItems: (token: string, params?: FoundItemsQueryParams) =>
    request<{ items: FoundItem[]; pagination: Pagination }>('/found/my-items', { token, params }),

  // Claim a found item
  claim: (token: string, id: string, claimMessage?: string) =>
    request<{ item: FoundItem }>(`/found/${id}/claim`, { method: 'POST', token, body: { claimMessage } }),

  // Unclaim a found item
  unclaim: (token: string, id: string) =>
    request<{ item: FoundItem }>(`/found/${id}/unclaim`, { method: 'POST', token }),

  // Update item status
  updateStatus: (token: string, id: string, status: FoundItem['status'], notes?: string) =>
    request<{ item: FoundItem }>(`/found/${id}/status`, { method: 'PATCH', token, body: { status, notes } }),
};

export default request;
