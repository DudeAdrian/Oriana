import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { videoAPI, commentAPI, likeAPI } from '../api/client';

export const VideoDetailScreen = ({ route, navigation }) => {
  const { videoId } = route.params;
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    loadVideoDetails();
  }, [videoId]);

  const loadVideoDetails = async () => {
    try {
      setLoading(true);
      const [videoRes, commentsRes] = await Promise.all([
        videoAPI.get(videoId),
        commentAPI.getVideoComments(videoId)
      ]);

      setVideo(videoRes.data);
      setComments(commentsRes.data);
      setIsLiked(videoRes.data.isLiked || false);
    } catch (error) {
      console.error('Error loading video details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await likeAPI.like(videoId);
      setIsLiked(!isLiked);
      setVideo({
        ...video,
        _count: {
          ...video._count,
          likes: isLiked ? video._count.likes - 1 : video._count.likes + 1
        }
      });
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await commentAPI.create(videoId, newComment);
      setComments([{ ...response.data }, ...comments]);
      setNewComment('');
      setVideo({
        ...video,
        _count: {
          ...video._count,
          comments: video._count.comments + 1
        }
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#25f4ee" />
      </View>
    );
  }

  if (!video) {
    return (
      <View style={styles.centerContainer}>
        <Text>Video not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image
        source={{ uri: video.thumbnailUrl || 'https://via.placeholder.com/400x600' }}
        style={styles.thumbnail}
      />

      <View style={styles.videoInfo}>
        <View style={styles.userSection}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Profile', { userId: video.user.id })
            }
          >
            <Image
              source={{ uri: video.user.profileImage || 'https://via.placeholder.com/40' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View style={styles.userDetails}>
            <Text style={styles.username}>{video.user.username}</Text>
            <Text style={styles.title}>{video.title}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <TouchableOpacity style={styles.statItem} onPress={handleLike}>
            <Text style={[styles.statIcon, isLiked && styles.liked]}>
              {isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={styles.statCount}>{video._count.likes}</Text>
          </TouchableOpacity>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💬</Text>
            <Text style={styles.statCount}>{video._count.comments}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>↪️</Text>
            <Text style={styles.statCount}>Share</Text>
          </View>
        </View>

        <View style={styles.description}>
          <Text style={styles.descriptionText}>{video.description}</Text>
        </View>
      </View>

      <Text style={styles.commentsTitle}>Comments</Text>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Image
              source={{ uri: item.user.profileImage || 'https://via.placeholder.com/30' }}
              style={styles.commentAvatar}
            />
            <View style={styles.commentContent}>
              <Text style={styles.commentUsername}>{item.user.username}</Text>
              <Text style={styles.commentText}>{item.content}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleAddComment}>
          <Text style={styles.submitButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  thumbnail: {
    width: '100%',
    height: 300,
    backgroundColor: '#000'
  },
  videoInfo: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  userSection: {
    flexDirection: 'row',
    marginBottom: 10
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  userDetails: {
    flex: 1
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12
  },
  statItem: {
    alignItems: 'center'
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4
  },
  liked: {
    color: 'red'
  },
  statCount: {
    fontSize: 12,
    fontWeight: '600'
  },
  description: {
    marginTop: 10
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginVertical: 10
  },
  comment: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  commentContent: {
    flex: 1
  },
  commentUsername: {
    fontWeight: 'bold',
    fontSize: 12
  },
  commentText: {
    fontSize: 13,
    marginTop: 4
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 8
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  submitButton: {
    backgroundColor: '#25f4ee',
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: 'center'
  },
  submitButtonText: {
    fontWeight: 'bold',
    fontSize: 12
  }
});
