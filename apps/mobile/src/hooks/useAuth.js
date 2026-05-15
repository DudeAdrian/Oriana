import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../api/client';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('currentUser');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to restore token', e);
    } finally {
      setLoading(false);
    }
  };

  const authContext = {
    signIn: async (email, password) => {
      try {
        const response = await authAPI.login(email, password);
        const { token, user } = response.data;

        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));

        setToken(token);
        setUser(user);
        return { success: true };
      } catch (err) {
        const message = err.response?.data?.message || 'Login failed';
        setError(message);
        return { success: false, error: message };
      }
    },

    signUp: async (email, username, password, displayName) => {
      try {
        const response = await authAPI.register(email, username, password, displayName);
        const { token, user } = response.data;

        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));

        setToken(token);
        setUser(user);
        return { success: true };
      } catch (err) {
        const message = err.response?.data?.message || 'Registration failed';
        setError(message);
        return { success: false, error: message };
      }
    },

    signOut: async () => {
      try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('currentUser');
        setToken(null);
        setUser(null);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    },

    updateUser: (userData) => {
      setUser(userData);
      AsyncStorage.setItem('currentUser', JSON.stringify(userData));
    }
  };

  return {
    state: { isLoading: loading, token, user },
    ...authContext
  };
};

export const useFeed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreVideos = async (skip = 0) => {
    try {
      setLoading(true);
      const response = await feedAPI.getHomeFeed(skip, 10);
      if (skip === 0) {
        setVideos(response.data);
      } else {
        setVideos([...videos, ...response.data]);
      }
      setHasMore(response.data.length === 10);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { videos, loading, error, hasMore, loadMoreVideos };
};

export const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile(userId);
      setUser(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, refetch: loadUser };
};
