import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { userAPI, followAPI, videoAPI } from '../api/client';
import { VideoCard } from '../components/VideoCard';

export const ProfileScreen = ({ route, navigation, currentUserId }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [userRes, videosRes] = await Promise.all([
        userAPI.getProfile(userId),
        videoAPI.getUserVideos(userId)
      ]);

      setUser(userRes.data);
      setVideos(videosRes.data);

      if (currentUserId && currentUserId !== userId) {
        const statusRes = await followAPI.isFollowing(currentUserId, userId);
        setIsFollowing(statusRes.data.isFollowing);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await followAPI.follow(userId);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleMessage = () => {
    navigation.navigate('Messages', { userId });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#25f4ee" />
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.profileInfo}>
        <Image
          source={{ uri: user.profileImage || 'https://via.placeholder.com/80' }}
          style={styles.avatar}
        />
        <Text style={styles.displayName}>{user.displayName}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.bio}>{user.bio}</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user._count?.videos || 0}</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user._count?.followers || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user._count?.following || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {currentUserId && currentUserId !== userId && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, isFollowing && styles.followingButton]}
              onPress={handleFollow}
            >
              <Text style={styles.buttonText}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleMessage}>
              <Text style={styles.buttonText}>Message</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text style={styles.videosTitle}>Videos</Text>
    </View>
  );

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            onPress={() => navigation.navigate('VideoDetail', { videoId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
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
  },
  headerContainer: {
    backgroundColor: '#fff',
  },
  profileInfo: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 10
  },
  displayName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  username: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4
  },
  bio: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    color: '#333'
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  stat: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  actions: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10
  },
  button: {
    flex: 1,
    backgroundColor: '#25f4ee',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  followingButton: {
    backgroundColor: '#f0f0f0'
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000'
  },
  videosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 20,
    marginVertical: 15
  },
  listContent: {
    paddingBottom: 20
  }
});
