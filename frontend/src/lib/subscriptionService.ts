import axios from 'axios';
import { API_BASE_URL } from './config';

const API_URL = API_BASE_URL;

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
  // Get AI usage statistics
  getUsage: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/ai/usage`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Failed to get AI usage' };
    }
  },

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

  // Extract key points
  extractKeyPoints: async (text: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/ai/extract-key-points`,
        { text },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Failed to extract key points' };
    }
  },

  // Generate flashcards
  generateFlashcards: async (text: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/ai/generate-flashcards`,
        { text },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Failed to generate flashcards' };
    }
  },

  // Generate quiz
  generateQuiz: async (text: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/ai/generate-quiz`,
        { text },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Failed to generate quiz' };
    }
  },

  // Rewrite and improve text
  rewriteImprove: async (text: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/ai/rewrite-improve`,
        { text },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Failed to rewrite text' };
    }
  },

  // Transform note
  transformNote: async (text: string, transformType: string = 'outline') => {
    try {
      const response = await axios.post(
        `${API_URL}/ai/transform-note`,
        { text, transform_type: transformType },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Failed to transform note' };
    }
  },
};
