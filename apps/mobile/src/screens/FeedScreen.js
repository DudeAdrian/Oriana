import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Text,
  Dimensions,
  Switch
} from 'react-native';
import { VideoCard } from '../components/VideoCard';
import { feedAPI, likeAPI } from '../api/client';
import P2PBridge from '../services/P2PBridge';
import LedgerWitness from '../services/LedgerWitness';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const FeedScreen = ({ navigation, userId }) => {
  const [videos, setVideos] = useState([]);
  const [isStandaloneMode, setIsStandaloneMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const isMounted = React.useRef(true);

  const setupRadioMode = useCallback(async () => {
    setIsStandaloneMode(true);
    await LedgerWitness.initialize();
    
    P2PBridge.on('survivorFound', async (node) => {
      // Autonomous mesh discovery logic
      const mockPayload = {
        id: `mesh-${node.id}`,
        title: `Radio Broadcast: ${node.id}`,
        description: 'Decentralized transmission witnessed via Terracare Ledger.',
        videoUrl: 'https://placeholder.com/mesh-video.mp4',
        user: {
          username: node.id,
          displayName: `Survivor ${node.id.split('-')[1] || 'Node'}`,
        },
        isWitnessed: true
      };

      const mockSignature = await LedgerWitness.signPayload(mockPayload);
      const isValid = await LedgerWitness.verifyPayload(mockPayload, mockSignature, node.id);

      if (isValid) {
        setVideos(prev => {
          if (prev.find(v => v.id === mockPayload.id)) return prev;
          return [mockPayload, ...prev];
        });
      }
    });

    await P2PBridge.startDiscovery();
  }, []);

  const loadFeed = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const response = await feedAPI.getHomeFeed(isInitial ? 0 : skip, 10);
      
      const newVideos = response.data || [];
      if (isInitial) {
        setVideos(newVideos);
      } else {
        setVideos(prev => [...prev, ...newVideos]);
      }
      
      setHasMore(newVideos.length === 10);
      setSkip(prev => isInitial ? 10 : prev + 10);
      setIsStandaloneMode(false);
    } catch (error) {
      console.warn('[Oriana-Feed] Cloud unreachable. Triggering Fail-Safe Mesh...', error);
      if (isInitial) {
        setVideos([]);
        await setupRadioMode();
      }
    } finally {
      setLoading(false);
    }
  }, [skip, setupRadioMode]);

  useEffect(() => {
    isMounted.current = true;
    loadFeed(true);

    return () => {
      isMounted.current = false;
      P2PBridge.stopDiscovery();
      P2PBridge.removeAllListeners('survivorFound');
    };
  }, [loadFeed]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (isStandaloneMode) {
      setVideos([]);
      await setupRadioMode();
    } else {
      setSkip(0);
      await loadFeed(true);
    }
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (isStandaloneMode || !hasMore || loading) return;

    try {
      await loadFeed(false);
    } catch (error) {
      console.error('Error loading more videos:', error);
    }
  };

  const handleLike = async (videoId) => {
    if (isStandaloneMode) return;
    try {
      await likeAPI.like(videoId);
      // Update UI
      setVideos(videos.map(v => {
        if (v.id === videoId) {
          return {
            ...v,
            isLiked: !v.isLiked,
            _count: {
              ...(v._count || { likes: 0, comments: 0 }),
              likes: (v._count?.likes || 0) + (v.isLiked ? -1 : 1)
            }
          };
        }
        return v;
      }));
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>
        {isStandaloneMode ? '📟 Radio Station' : '📱 Cloud Feed'}
      </Text>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Apocalypse Mode</Text>
        <Switch
          value={isStandaloneMode}
          onValueChange={(val) => {
            if (val) setupRadioMode();
            else loadFeed(true);
          }}
        />
      </View>
    </View>
  );

  if (loading && videos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#25f4ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.statusIndicator}>
        <Text style={[styles.statusIcon, isStandaloneMode && styles.statusIconGold]}>
          {isStandaloneMode ? '🟡' : '🌐'}
        </Text>
        <Text style={styles.statusText}>
          {isStandaloneMode ? 'Sovereign Mode' : 'Cloud Connected'}
        </Text>
      </View>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            onPress={(videoId) => navigation.navigate('VideoDetail', { videoId })}
            onLike={() => handleLike(item.id)}
          />
        )}
        onEndReached={isStandaloneMode ? null : loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#25f4ee" />
        }
        ListEmptyComponent={
          isStandaloneMode ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Scanning for nearby survivors...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#111',
    zIndex: 20
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  toggleLabel: {
    color: '#aaa',
    marginRight: 10,
    fontSize: 12
  },
  statusIndicator: {
    position: 'absolute',
    top: 100,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: 5
  },
  statusIconGold: {
    color: '#FFD700'
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center'
  },
  emptyText: {
    color: '#666',
    fontSize: 16
  }
});
