import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  Image
} from 'react-native';
import { userAPI } from '../api/client';
import { UserCard } from '../components/VideoCard';

export const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text) => {
    setQuery(text);

    if (text.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await userAPI.search(text);
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={query}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>

      {loading && <ActivityIndicator color="#25f4ee" style={styles.loader} />}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onPress={() => navigation.navigate('Profile', { userId: item.id })}
            isFollowing={false}
            onFollowPress={() => console.log('Follow:', item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  searchBox: {
    padding: 15,
    backgroundColor: '#f5f5f5'
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  loader: {
    marginTop: 20
  }
});
