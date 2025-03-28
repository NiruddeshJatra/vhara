// Application configuration
const config = {
  // API endpoint (for regular API calls)
  apiUrl: 'http://localhost:8000/api',
  
  // Base URL for the application
  baseUrl: 'http://localhost:8000',
  
  // Development mode (set to false in production)
  isDevelopment: true,
  
  // Authentication settings
  auth: {
    // Local storage keys
    tokenStorageKey: 'access_token',
    userStorageKey: 'user',
    
    // Authentication endpoints (note: these don't use the /api prefix)
    refreshTokenEndpoint: '/auth/token/refresh/',
    loginEndpoint: '/auth/login/',
    registerEndpoint: '/auth/registration/',
    logoutEndpoint: '/auth/logout/',
    verifyEmailEndpoint: '/auth/registration/verify-email/',
    emailVerificationEndpoint: '/api/users/verify-email/',
    passwordResetEndpoint: '/auth/password/reset/',
    passwordResetConfirmEndpoint: '/auth/password/reset/confirm/',
  },
};

export default config;
