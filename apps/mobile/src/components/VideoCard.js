import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export const VideoCard = ({ video, onPress, onLike }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(video.id)}>
      <Image
        source={{ uri: video.thumbnailUrl || 'https://via.placeholder.com/400x600' }}
        style={styles.thumbnail}
      />
      <View style={styles.overlay}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: video.user.profileImage || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
          <Text style={styles.username} numberOfLines={1}>
            {video.user.username}
          </Text>
        </View>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>❤️</Text>
            <Text style={styles.statText}>{video._count?.likes || 0}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>💬</Text>
            <Text style={styles.statText}>{video._count?.comments || 0}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {video.title}
      </Text>
    </TouchableOpacity>
  );
};

export const UserCard = ({ user, onPress, isFollowing, onFollowPress }) => {
  return (
    <TouchableOpacity style={styles.userCardContainer} onPress={() => onPress(user.id)}>
      <Image
        source={{ uri: user.profileImage || 'https://via.placeholder.com/60' }}
        style={styles.userCardAvatar}
      />
      <View style={styles.userCardInfo}>
        <Text style={styles.userCardName}>{user.displayName}</Text>
        <Text style={styles.userCardUsername}>@{user.username}</Text>
      </View>
      <TouchableOpacity
        style={[styles.followButton, isFollowing && styles.followingButton]}
        onPress={() => onFollowPress(user.id)}
      >
        <Text style={styles.followButtonText}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 600,
    backgroundColor: '#000',
    marginBottom: 10,
    position: 'relative'
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingBottom: 50
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 10
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    gap: 15
  },
  stat: {
    alignItems: 'center'
  },
  statIcon: {
    fontSize: 20
  },
  statText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2
  },
  title: {
    color: '#fff',
    padding: 10,
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  userCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  userCardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },
  userCardInfo: {
    flex: 1
  },
  userCardName: {
    fontWeight: 'bold',
    fontSize: 14
  },
  userCardUsername: {
    color: '#666',
    fontSize: 12,
    marginTop: 2
  },
  followButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#25f4ee',
    borderRadius: 20
  },
  followingButton: {
    backgroundColor: '#f0f0f0'
  },
  followButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000'
  }
});
