import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchNewWord = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://random-word-api.herokuapp.com/word');
      const [word] = await res.json();

      const defRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const defData = await defRes.json();

      const definition = defData[0]?.meanings[0]?.definitions[0]?.definition;
      const example = defData[0]?.meanings[0]?.definitions[0]?.example;

      const newWord = {
        word,
        definition,
        example,
        date: new Date().toISOString()
      };

      setWordData(newWord);

      const existingHistory = JSON.parse(await AsyncStorage.getItem('history')) || [];
      await AsyncStorage.setItem('history', JSON.stringify([newWord, ...existingHistory]));
    } catch (err) {
      console.error('Failed to fetch word:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewWord();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white px-4 mt-20 pt-10">
      <Text className="text-3xl font-bold pb-8 text-center text-gray-800">Word Of The Day</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : wordData ? (
        <View className="space-y-4">
          <Text className="text-2xl font-bold text-blue-600">{wordData.word}</Text>
          <Text className="text-base text-gray-700">Definition: {wordData.definition}</Text>
          <Text className="text-base italic text-gray-600">Example: {wordData.example || 'N/A'}</Text>
        </View>
      ) : (
        <Text>Loading word...</Text>
      )}

      <TouchableOpacity
        className="bg-blue-500 mt-8 py-3 rounded-xl"
        onPress={fetchNewWord}
      >
        <Text className="text-white text-center font-semibold text-lg">New Word</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/(tabs)/history')}
        className="flex-row items-center justify-center mt-4"
      >
        <Ionicons name="time-outline" size={20} color="#4b5563" />
        <Text className="ml-2 text-gray-700 underline">View History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

