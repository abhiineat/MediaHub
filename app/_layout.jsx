import { Stack } from 'expo-router';
import React from 'react';
import '../global.css';
import { AuthProvider } from './context/AuthContext'; // ✅ import properly

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
