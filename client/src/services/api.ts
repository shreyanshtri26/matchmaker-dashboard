import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Customer, User, Match, MatchSuggestion, ApiError, PaginationParams, PaginatedResponse } from '../types';

// Create axios instance with base URL and common headers
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include auth token in headers
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(error);
    }
  }
);

// Helper function to handle API calls with proper typing
const apiRequest = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api[method]<T>(url, data, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'An error occurred');
    }
    throw error;
  }
};

// Auth API
export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  return apiRequest('post', '/auth/login', { email, password });
};

export const logout = async (): Promise<void> => {
  return apiRequest('post', '/auth/logout');
};

export const getCurrentUser = async (): Promise<User> => {
  return apiRequest('get', '/auth/me');
};

// Customers API
export const getCustomers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<{ data: Customer[]; total: number }> => {
  return apiRequest('get', '/customers', { params });
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  return apiRequest('get', `/customers/${id}`);
};

export const createCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> => {
  return apiRequest('post', '/customers', customerData);
};

export const updateCustomer = async (id: string, customerData: Partial<Customer>): Promise<Customer> => {
  return apiRequest('put', `/customers/${id}`, customerData);
};

export const deleteCustomer = async (id: string): Promise<void> => {
  return apiRequest('delete', `/customers/${id}`);
};

export const addNoteToCustomer = async (id: string, note: string): Promise<Customer> => {
  return apiRequest('post', `/customers/${id}/notes`, { note });
};

// Matches API
export const getMatchSuggestions = async (customerId: string): Promise<MatchSuggestion[]> => {
  return apiRequest('get', `/matches/suggestions/${customerId}`);
};

export const sendMatchRequest = async (data: {
  customerId: string;
  matchId: string;
  message?: string;
}): Promise<{ success: boolean; match: Match }> => {
  return apiRequest('post', '/matches/request', data);
};

export const getCustomerMatches = async (customerId: string): Promise<Match[]> => {
  return apiRequest('get', `/matches/customer/${customerId}`);
};

export const getMatchDetails = async (matchId: string): Promise<Match> => {
  return apiRequest('get', `/matches/${matchId}`);
};

// Admin API
export const generateMatchReport = async (params: {
  startDate?: string;
  endDate?: string;
  status?: string;
}): Promise<{ url: string }> => {
  return apiRequest('get', '/admin/reports/matches', { params });
};

// Utility function to handle file uploads
export const uploadFile = async (file: File, path: string = 'profiles'): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', path);

  const response = await api.post<{ url: string }>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Customer API
export const fetchCustomers = async (params: PaginationParams): Promise<PaginatedResponse<Customer>> => {
  try {
    const response = await api.get<PaginatedResponse<Customer>>('/customers', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

// Export the axios instance in case it's needed directly
export { api as axios };
