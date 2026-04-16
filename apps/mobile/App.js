import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { Text } from 'react-native';
import { useAuth } from './src/hooks/useAuth';
import { LoginScreen, SignUpScreen } from './src/screens/AuthScreens';
import { FeedScreen } from './src/screens/FeedScreen';
import { DiscoveryScreen } from './src/screens/DiscoveryScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { VideoDetailScreen } from './src/screens/VideoDetailScreen';
import { MessagesScreen, ChatScreen } from './src/screens/MessagesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = ({ signIn, signUp }) => {
  const [authMode, setAuthMode] = useState('login');

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false
      }}
    >
      {authMode === 'login' ? (
        <Stack.Screen
          name="Login"
          options={{
            animationEnabled: false
          }}
        >
          {(props) => (
            <LoginScreen
              onLogin={async (email, password) => {
                const result = await signIn(email, password);
                if (!result.success) {
                  setAuthMode('signup');
                }
                return result;
              }}
            />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen
          name="SignUp"
          options={{
            animationEnabled: false
          }}
        >
          {(props) => (
            <SignUpScreen
              onSignUp={async (email, username, password, displayName) => {
                const result = await signUp(email, username, password, displayName);
                if (result.success) {
                  setAuthMode('login');
                }
                return result;
              }}
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

const FeedStack = ({ user }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FeedHome"
        options={{ headerTitle: 'For You' }}
      >
        {(props) => <FeedScreen {...props} userId={user?.id} />}
      </Stack.Screen>
      <Stack.Screen
        name="VideoDetail"
        component={VideoDetailScreen}
        options={{ headerTitle: 'Video' }}
      />
      <Stack.Screen
        name="Profile"
        options={{ headerTitle: 'Profile' }}
      >
        {(props) => <ProfileScreen {...props} currentUserId={user?.id} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const DiscoveryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DiscoveryHome"
        component={DiscoveryScreen}
        options={{ headerTitle: 'Discover' }}
      />
      <Stack.Screen
        name="VideoDetail"
        component={VideoDetailScreen}
        options={{ headerTitle: 'Video' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerTitle: 'Profile' }}
      />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchHome"
        component={SearchScreen}
        options={{ headerTitle: 'Search' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerTitle: 'Profile' }}
      />
    </Stack.Navigator>
  );
};

const MessagesStack = ({ user }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MessagesList"
        component={MessagesScreen}
        options={{ headerTitle: 'Messages' }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerTitle: 'Chat' }}
      />
    </Stack.Navigator>
  );
};

const AppStack = ({ user, signOut }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#25f4ee',
        tabBarInactiveTintColor: '#999',
        headerShown: true
      }}
    >
      <Tab.Screen
        name="Feed"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>
        }}
      >
        {(props) => <FeedStack {...props} user={user} />}
      </Tab.Screen>

      <Tab.Screen
        name="Discovery"
        component={DiscoveryStack}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🔍</Text>
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🔎</Text>
        }}
      />

      <Tab.Screen
        name="Messages"
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💬</Text>
        }}
      >
        {(props) => <MessagesStack {...props} user={user} />}
      </Tab.Screen>

      <Tab.Screen
        name="MyProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>
        }}
        initialParams={{ userId: user?.id }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const auth = useAuth();
  const { state, signIn, signUp, signOut } = auth;

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#25f4ee" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {state.token ? (
        <AppStack user={state.user} signOut={signOut} />
      ) : (
        <AuthStack signIn={signIn} signUp={signUp} />
      )}
    </NavigationContainer>
  );
}
