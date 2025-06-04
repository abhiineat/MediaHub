import { useRouter } from 'expo-router';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Check for 'accessToken' as saved by your Login page
        const token = await AsyncStorage.getItem('accessToken');
        setHasToken(!!token);
      } catch (error) {
        console.log('Error reading token from AsyncStorage:', error);
      }
    };

    checkToken();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 p-3 mt-10">
        <View className="flex-row justify-end items-center mt-2 mb-4">
          {hasToken ? (
            <TouchableOpacity
              onPress={() => router.push('/profile')}
              className="p-2 rounded-full bg-gray-200"
            >
              <Ionicons name="person-circle" size={36} color="black" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                className="bg-gray-300 rounded-xl m-1 py-2 px-4"
                onPress={() => router.push('/login')}
              >
                <Text className="text-black font-semibold">Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-blue-600 rounded-xl py-2 m-1 px-4"
                onPress={() => router.push('/register')}
              >
                <Text className="text-white font-semibold">Register</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Centered app description */}
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-2xl font-bold mb-4 text-center">
            Welcome to MediaHub
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
