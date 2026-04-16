import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { VideoCard } from '../components/VideoCard';
import { feedAPI, likeAPI } from '../api/client';

export const FeedScreen = ({ navigation, userId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const response = await feedAPI.getHomeFeed(0, 10);
      setVideos(response.data);
      setHasMore(response.data.length === 10);
      setSkip(10);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;

    try {
      const response = await feedAPI.getHomeFeed(skip, 10);
      setVideos([...videos, ...response.data]);
      setHasMore(response.data.length === 10);
      setSkip(skip + 10);
    } catch (error) {
      console.error('Error loading more videos:', error);
    }
  };

  const handleLike = async (videoId) => {
    try {
      await likeAPI.like(videoId);
      // Update UI
      setVideos(videos.map(v => {
        if (v.id === videoId) {
          return {
            ...v,
            isLiked: !v.isLiked,
            _count: {
              ...v._count,
              likes: v.isLiked ? v._count.likes - 1 : v._count.likes + 1
            }
          };
        }
        return v;
      }));
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  if (loading && videos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#25f4ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            onPress={(videoId) => navigation.navigate('VideoDetail', { videoId })}
            onLike={() => handleLike(item.id)}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
