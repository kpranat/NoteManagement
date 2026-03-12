import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Subscription Service
export const subscriptionService = {
  // Get subscription status
  getStatus: async () => {
    try {
      const response = await axios.get(`${API_URL}/subscription/status`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Failed to get subscription status' };
    }
  },

  // Upgrade to premium
  upgrade: async (durationDays: number = 30) => {
    try {
      const response = await axios.post(
        `${API_URL}/subscription/upgrade`,
        { duration_days: durationDays },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Failed to upgrade subscription' };
    }
  },

  // Cancel subscription
  cancel: async () => {
    try {
      const response = await axios.post(
        `${API_URL}/subscription/cancel`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Failed to cancel subscription' };
    }
  },

  // Get access logs
  getAccessLogs: async (limit: number = 50) => {
    try {
      const response = await axios.get(
        `${API_URL}/subscription/access-logs?limit=${limit}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Failed to get access logs' };
    }
  },
};

// AI Service (Premium features)
export const aiService = {
  // Summarize text
  summarize: async (text: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/ai/summarize`,
        { text },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Failed to summarize text' };
    }
  },

  // Enhance content
  enhance: async (text: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/ai/enhance`,
        { text },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Failed to enhance content' };
    }
  },

  // Suggest tags
  suggestTags: async (text: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/ai/suggest-tags`,
        { text },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Failed to suggest tags' };
    }
  },

  // Sentiment analysis
  analyzeSentiment: async (text: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/ai/sentiment-analysis`,
        { text },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Failed to analyze sentiment' };
    }
  },

  // Generate insights
  generateInsights: async (noteId: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/ai/generate-insights`,
        { note_id: noteId },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Failed to generate insights' };
    }
  },
};
