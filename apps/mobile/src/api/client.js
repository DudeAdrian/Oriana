import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For Android Emulator, localhost is 10.0.2.2, for iOS it's localhost.
// Using the environment variable set by our script is the safest method.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error adding token to request:', error);
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('currentUser');
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (email, username, password, displayName) =>
    api.post('/auth/register', { email, username, password, displayName }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  verify: () => api.get('/auth/verify')
};

// User endpoints
export const userAPI = {
  getProfile: (userId) => api.get(`/users/profile/${userId}`),
  getByUsername: (username) => api.get(`/users/username/${username}`),
  search: (query) => api.get('/users/search', { params: { q: query } }),
  updateProfile: (data) => api.put('/users/profile', data)
};

// Video endpoints
export const videoAPI = {
  create: (data) => api.post('/videos', data),
  get: (videoId) => api.get(`/videos/${videoId}`),
  getUserVideos: (userId, skip = 0, take = 10) =>
    api.get(`/videos/user/${userId}`, { params: { skip, take } }),
  delete: (videoId) => api.delete(`/videos/${videoId}`)
};

// Feed endpoints
export const feedAPI = {
  getHomeFeed: (skip = 0, take = 10) =>
    api.get('/feed', { params: { skip, take } }),
  getDiscovery: (skip = 0, take = 10) =>
    api.get('/feed/discover', { params: { skip, take } })
};

// Like endpoints
export const likeAPI = {
  like: (videoId) => api.post('/likes', { videoId }),
  getCount: (videoId) => api.get(`/likes/video/${videoId}`)
};

// Comment endpoints
export const commentAPI = {
  create: (videoId, content) =>
    api.post('/comments', { videoId, content }),
  getVideoComments: (videoId, skip = 0, take = 20) =>
    api.get(`/comments/video/${videoId}`, { params: { skip, take } }),
  delete: (commentId) => api.delete(`/comments/${commentId}`)
};

// Follow endpoints
export const followAPI = {
  follow: (followingId) => api.post('/follows', { followingId }),
  getFollowers: (userId, skip = 0, take = 20) =>
    api.get(`/follows/${userId}/followers`, { params: { skip, take } }),
  getFollowing: (userId, skip = 0, take = 20) =>
    api.get(`/follows/${userId}/following`, { params: { skip, take } }),
  isFollowing: (followerId, followingId) =>
    api.get(`/follows/${followerId}/${followingId}/status`)
};

// Notification endpoints
export const notificationAPI = {
  getNotifications: (skip = 0, take = 20) =>
    api.get('/notifications', { params: { skip, take } }),
  markAsRead: (notificationId) =>
    api.put(`/notifications/${notificationId}/read`),
  getUnreadCount: () => api.get('/notifications/unread-count')
};

// Message endpoints
export const messageAPI = {
  send: (receiverId, content) =>
    api.post('/messages', { receiverId, content }),
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (otherUserId, skip = 0, take = 50) =>
    api.get(`/messages/conversation/${otherUserId}`, { params: { skip, take } }),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`)
};

export default api;
