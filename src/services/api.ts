// src/services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'my-jwt'; // Key to store the token

// Use the environment variable, fallback for safety (though fallback isn't ideal)
const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

console.log('>>> USING API BASE URL:', baseURL);

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Utility functions for token storage
export const saveToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    // Set default header for subsequent requests in this session
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
     console.log('Token saved successfully');
  } catch (error) {
    console.error('Failed to save token:', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    // Remove default header
    delete api.defaults.headers.common['Authorization'];
     console.log('Token removed successfully');
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

export default api;