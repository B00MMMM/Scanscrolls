import axios from 'axios';

// TypeScript interfaces
export interface MangaResponse {
  manga: any[];
  page: number;
  limit: number;
  total: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    preferences: {
      theme: 'light' | 'dark';
      readingMode: 'single' | 'double' | 'webtoon';
    };
  };
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds for manga APIs
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // You might want to redirect to login page here
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Manga API functions
export const mangaAPI = {
  // Get popular manga
  getPopular: async (page: number = 1, limit: number = 20): Promise<MangaResponse> => {
    const response = await api.get(`/manga/popular?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get latest manga
  getLatest: async (page: number = 1, limit: number = 20): Promise<MangaResponse> => {
    const response = await api.get(`/manga/latest?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Search manga
  search: async (query: string, page: number = 1, limit: number = 20): Promise<MangaResponse> => {
    const response = await api.get(`/manga/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get manga details
  getDetails: async (id: string) => {
    const response = await api.get(`/manga/${id}`);
    return response.data;
  },

  // Get manga chapters
  getChapters: async (id: string, page: number = 1, limit: number = 100) => {
    const response = await api.get(`/manga/${id}/chapters?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get chapter pages
  getChapterPages: async (chapterId: string) => {
    const response = await api.get(`/manga/chapter/${chapterId}/pages`);
    return response.data;
  },
};

// Auth API functions
export const authAPI = {
  // Register user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials: UserCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// User API functions
export const userAPI = {
  // Update preferences
  updatePreferences: async (preferences: any) => {
    const response = await api.patch('/user/preferences', preferences);
    return response.data;
  },

  // Add to reading history
  addToHistory: async (historyData: any) => {
    const response = await api.post('/user/history', historyData);
    return response.data;
  },

  // Get reading history
  getHistory: async (page: number = 1, limit: number = 20) => {
    const response = await api.get(`/user/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Add to favorites
  addToFavorites: async (mangaData: any) => {
    const response = await api.post('/user/favorites', mangaData);
    return response.data;
  },

  // Remove from favorites
  removeFromFavorites: async (mangaId: string) => {
    const response = await api.delete(`/user/favorites/${mangaId}`);
    return response.data;
  },

  // Get favorites
  getFavorites: async (page: number = 1, limit: number = 20) => {
    const response = await api.get(`/user/favorites?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Add to search history
  addToSearchHistory: async (query: string) => {
    const response = await api.post('/user/search-history', { query });
    return response.data;
  },

  // Get search history
  getSearchHistory: async () => {
    const response = await api.get('/user/search-history');
    return response.data;
  },
};

// Comments API functions
export const commentsAPI = {
  // Get comments for manga
  getMangaComments: async (mangaId: string, page: number = 1, limit: number = 10) => {
    const response = await api.get(`/comments/manga/${mangaId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get comments for chapter
  getChapterComments: async (chapterId: string, page: number = 1, limit: number = 10) => {
    const response = await api.get(`/comments/chapter/${chapterId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Create comment
  createComment: async (commentData: any) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  // Like/unlike comment
  toggleLike: async (commentId: string) => {
    const response = await api.post(`/comments/${commentId}/like`);
    return response.data;
  },

  // Reply to comment
  replyToComment: async (commentId: string, content: string) => {
    const response = await api.post(`/comments/${commentId}/reply`, { content });
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId: string) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },
};

export default api;
