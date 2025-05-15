import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function History() {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const stored = await AsyncStorage.getItem('history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  };

  const clearHistory = async () => {
    Alert.alert("Clear History", "Are you sure you want to delete all history?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await AsyncStorage.removeItem('history');
          setHistory([]);
        },
      },
    ]);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toDateString() + ' ' + date.toLocaleTimeString();
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-10">
      <View className="flex-row justify-between pt-8 items-center mb-4">
        <Text className="text-2xl  font-bold">History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <Text className="text-red-500 font-semibold">Clear History</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <Text className="text-gray-500 text-center mt-10">No words viewed yet.</Text>
      ) : (
        history.map((item, index) => (
          <View
            key={index}
            className="border border-gray-200 rounded-xl p-4 mb-3 bg-gray-50"
          >
            <Text className="text-lg font-bold text-blue-600">{item.word}</Text>
            <Text className="text-sm text-gray-700 mt-1">
              Definition: {item.definition}
            </Text>
            {item.example && (
              <Text className="text-sm italic text-gray-600 mt-1">
                Example: {item.example}
              </Text>
            )}
            <Text className="text-xs text-gray-500 mt-2">
              Viewed on: {formatDate(item.date)}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
