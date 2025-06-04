import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { AuthContext } from './context/AuthContext'; // ✅ Import context

export const options = {
  title: 'Login',
  headerShown: false,
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { setIsLoggedIn } = useContext(AuthContext); // ✅ Use context

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://192.168.1.4:8000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Login Failed', data.message || 'Something went wrong');
      } else {
        // ✅ Save tokens and user info
        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        setIsLoggedIn(true); // ✅ Update auth state

        Alert.alert('Success', 'Logged in successfully');
        console.log('User:', data.user);

        // ✅ Navigate to (tabs)/home
        router.replace('(tabs)/home');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>
        Login
      </Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
  },
};
