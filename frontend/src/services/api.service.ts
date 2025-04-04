import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import config from '../config';

/**
 * Creates a configured Axios instance for API calls
 * Includes interceptors for authentication and error handling
 */
class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    // Create axios instance with base URL and credentials
    this.api = axios.create({
      baseURL: config.apiUrl,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for adding authentication token and transforming data
    this.api.interceptors.request.use(
      (reqConfig: AxiosRequestConfig) => {
        const token = localStorage.getItem(config.auth.tokenStorageKey);
        if (token && reqConfig.headers) {
          reqConfig.headers.Authorization = `Bearer ${token}`;
        }

        // Skip transformation for FormData requests
        if (!(reqConfig.data instanceof FormData)) {
          // Transform request data from camelCase to snake_case
          if (reqConfig.data) {
            reqConfig.data = this.transformToSnakeCase(reqConfig.data);
          }
        }

        return reqConfig;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor for handling errors and transforming data
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        // Transform response data from snake_case to camelCase
        if (response.data) {
          response.data = this.transformToCamelCase(response.data);
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 errors (unauthorized)
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          localStorage.getItem(config.auth.userStorageKey) &&
          !(originalRequest.url && originalRequest.url.includes('complete_profile'))
        ) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem(config.auth.refreshTokenStorageKey);
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const refreshResponse = await axios.post(
              `${config.baseUrl}${config.auth.refreshTokenEndpoint}`,
              { refresh: refreshToken },
              { withCredentials: true }
            );

            if (refreshResponse.data.access && originalRequest.headers) {
              localStorage.setItem(config.auth.tokenStorageKey, refreshResponse.data.access);
              originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            if (!(originalRequest.url && originalRequest.url.includes('complete_profile'))) {
              localStorage.removeItem(config.auth.userStorageKey);
              localStorage.removeItem(config.auth.tokenStorageKey);
              localStorage.removeItem(config.auth.refreshTokenStorageKey);
              toast.error('Your session has expired. Please log in again.');
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        // Handle product-specific errors
        if (error.response?.data && originalRequest.url?.includes('/products/')) {
          const errorData = error.response.data;
          console.error('Product API Error Details:', {
            status: error.response.status,
            data: errorData,
            request: {
              url: originalRequest.url,
              method: originalRequest.method,
              data: originalRequest.data
            }
          });
          
          // Product validation errors
          if (error.response.status === 400) {
            if (errorData.images) {
              return Promise.reject(new Error(`Image upload failed: ${errorData.images.join(', ')}`));
            }
            if (errorData.pricing_tiers) {
              const pricingError = typeof errorData.pricing_tiers === 'string' 
                ? errorData.pricing_tiers 
                : JSON.stringify(errorData.pricing_tiers);
              return Promise.reject(new Error(`Invalid pricing tiers: ${pricingError}`));
            }
            if (errorData.unavailable_dates) {
              return Promise.reject(new Error(`Invalid date range: ${errorData.unavailable_dates}`));
            }
            if (errorData.product_type) {
              return Promise.reject(new Error(`Invalid product type: ${errorData.product_type}`));
            }
            if (errorData.category) {
              return Promise.reject(new Error(`Invalid category: ${errorData.category}`));
            }
            if (errorData.purchase_year) {
              return Promise.reject(new Error(`Invalid purchase year: ${errorData.purchase_year}`));
            }
          }

          // Product status errors
          if (error.response.status === 403) {
            if (errorData.detail?.includes('status')) {
              return Promise.reject(new Error(`Cannot perform action in current status: ${errorData.detail}`));
            }
          }
        }

        // Handle other API errors
        if (error.response?.data) {
          const errorData = error.response.data;
          if (typeof errorData === 'string') {
            return Promise.reject(new Error(errorData));
          } else if (errorData.detail) {
            return Promise.reject(new Error(errorData.detail));
          } else if (errorData.non_field_errors) {
            return Promise.reject(new Error(errorData.non_field_errors[0]));
          } else if (errorData.message) {
            return Promise.reject(new Error(errorData.message));
          } else {
            const errorMessages = Object.entries(errorData)
              .map(([field, message]) => `${field}: ${message}`)
              .join(', ');
            return Promise.reject(new Error(`Validation error: ${errorMessages}`));
          }
        }

        return Promise.reject(new Error('Network error. Please check your connection and try again.'));
      }
    );
  }

  /**
   * Transform object keys from camelCase to snake_case
   */
  private transformToSnakeCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.transformToSnakeCase(item));
    }
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc: any, key: string) => {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        acc[snakeKey] = this.transformToSnakeCase(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  }

  /**
   * Transform object keys from snake_case to camelCase
   */
  private transformToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.transformToCamelCase(item));
    }
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc: any, key: string) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        acc[camelKey] = this.transformToCamelCase(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  }

  /**
   * Get singleton instance of ApiService
   */
  public static getInstance(): ApiService {
    if (!this.instance) {
      this.instance = new ApiService();
    }
    return this.instance;
  }

  /**
   * Get the configured axios instance
   */
  public getApi(): AxiosInstance {
    return this.api;
  }
}

// Export a singleton instance of the API service
export default ApiService.getInstance().getApi();
