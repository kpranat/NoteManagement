/**
 * API Configuration
 * Handles API base URL with proper formatting
 */

/**
 * Get the API base URL with proper formatting
 * - Removes trailing slashes
 * - Ensures /api suffix is present
 * - Falls back to localhost for development
 */
export const getApiBaseUrl = (): string => {
  let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Remove trailing slash if present
  apiUrl = apiUrl.replace(/\/$/, '');
  
  // Ensure /api suffix is present (unless already there)
  if (!apiUrl.endsWith('/api')) {
    apiUrl = `${apiUrl}/api`;
  }
  
  return apiUrl;
};

export const API_BASE_URL = getApiBaseUrl();
