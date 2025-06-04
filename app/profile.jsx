import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { AuthContext } from './context/AuthContext';


export const options = {
  title: 'Profile',
  headerShown: false,
};

export default function Profile() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user data from AsyncStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error('Failed to load user data', e);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.4:8000/api/users/logout', {
        method: 'POST',
        credentials: 'include', // send cookies if backend uses them
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      setIsLoggedIn(false);        // Update global auth state here
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 50 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Profile
      </Text>

      {user.profilePhotoUrl ? (
        <Image
          source={{ uri: user.profilePhotoUrl }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 20,
            alignSelf: 'center',
          }}
        />
      ) : null}

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>Full Name:</Text>
        <Text style={{ fontSize: 16, color: '#555' }}>
          {user.name || 'N/A'}
        </Text>
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>Email:</Text>
        <Text style={{ fontSize: 16, color: '#555' }}>
          {user.email || 'N/A'}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        disabled={loading}
        style={{
          backgroundColor: '#ef4444',
          paddingVertical: 14,
          borderRadius: 8,
          marginTop: 30,
          opacity: loading ? 0.7 : 1,
        }}
      >
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 16,
          }}
        >
          {loading ? 'Logging out...' : 'Logout'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
