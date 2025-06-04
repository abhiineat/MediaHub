import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

export const options = {
  title: 'Register',
  headerShown: false,
};

export default function Register() {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null); // store image URI
  const [loading, setLoading] = useState(false);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission required', 'Please allow access to media library.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };


  const handleRegister = async () => {
    if (!fullname || !username || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      // Use FormData if avatar is included
      const formData = new FormData();
      formData.append('fullname', fullname);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);

      if (avatar) {
        const fileName = avatar.split('/').pop();
        const fileType = fileName.split('.').pop();

        formData.append('avatar', {
          uri: avatar,
          name: fileName,
          type: `image/${fileType}`,
        });
      }

      const response = await fetch('http://192.168.1.4:8000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Registration Failed', data.message || 'Something went wrong');
      } else {
        Alert.alert('Success', 'Registered successfully');
        router.replace('/login');

      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network request failed');
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>Register</Text>

      <TextInput placeholder="Full Name" style={styles.input} value={fullname} onChangeText={setFullname} />
      <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput placeholder="Email" keyboardType="email-address" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.avatarBtn} onPress={pickAvatar}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          {avatar ? 'Change Avatar' : 'Choose Avatar'}
        </Text>
      </TouchableOpacity>

      {avatar && (
        <Image
          source={{ uri: avatar }}
          style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 20 }}
        />
      )}

      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          {loading ? 'Registering...' : 'Register'}
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
  avatarBtn: {
    backgroundColor: '#4b5563',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  registerBtn: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
  },
};
