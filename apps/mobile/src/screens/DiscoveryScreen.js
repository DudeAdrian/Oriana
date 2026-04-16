import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { feedAPI } from '../api/client';
import { VideoCard } from '../components/VideoCard';

export const DiscoveryScreen = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadDiscovery();
  }, []);

  const loadDiscovery = async () => {
    try {
      setLoading(true);
      const response = await feedAPI.getDiscovery(0, 10);
      setVideos(response.data);
      setHasMore(response.data.length === 10);
      setSkip(10);
    } catch (error) {
      console.error('Error loading discovery:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDiscovery();
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;

    try {
      const response = await feedAPI.getDiscovery(skip, 10);
      setVideos([...videos, ...response.data]);
      setHasMore(response.data.length === 10);
      setSkip(skip + 10);
    } catch (error) {
      console.error('Error loading more videos:', error);
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
