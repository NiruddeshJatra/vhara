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

    // Request interceptor for adding authentication token
    this.api.interceptors.request.use(
      (reqConfig: AxiosRequestConfig) => {
        const token = localStorage.getItem(config.auth.tokenStorageKey);
        if (token && reqConfig.headers) {
          reqConfig.headers.Authorization = `Bearer ${token}`;
        }
        return reqConfig;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor for handling errors and token refresh
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        // Handle 401 errors (unauthorized)
        if (
          error.response?.status === 401 &&
          !originalRequest._retry && 
          localStorage.getItem(config.auth.userStorageKey) // Check if user is logged in
        ) {
          originalRequest._retry = true;

          try {
            // Attempt to refresh the token
            const refreshResponse = await axios.post(
              `${config.apiUrl}${config.auth.refreshTokenEndpoint}`, 
              {}, 
              { withCredentials: true }
            );
            
            if (refreshResponse.data.access && originalRequest.headers) {
              // Update localStorage with new token
              localStorage.setItem(config.auth.tokenStorageKey, refreshResponse.data.access);
              
              // Update the Authorization header with the new token
              originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // If token refresh fails, logout the user
            localStorage.removeItem(config.auth.userStorageKey);
            localStorage.removeItem(config.auth.tokenStorageKey);
            toast.error('Your session has expired. Please log in again.');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle other API errors
        if (error.response?.data) {
          const errorData = error.response.data;
          
          // Log detailed error information for debugging
          console.error('API Error:', {
            status: error.response?.status,
            endpoint: originalRequest.url,
            data: errorData
          });
          
          // Format error message for user
          if (typeof errorData === 'string') {
            return Promise.reject(new Error(errorData));
          } else if (errorData.detail) {
            return Promise.reject(new Error(errorData.detail));
          } else if (errorData.non_field_errors) {
            return Promise.reject(new Error(errorData.non_field_errors[0]));
          }
        }
        
        return Promise.reject(error);
      }
    );
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
