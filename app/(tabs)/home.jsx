import { useRouter } from 'expo-router';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 p-3 mt-10">
        
        
        <View className="flex-row justify-end items-center mt-2 mb-4">
          <TouchableOpacity
            className="bg-gray-300 rounded-xl m-1 py-2 px-4"
            onPress={() => router.push('/login')}
          >
            <Text className="text-black font-semibold">Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-600 rounded-xl py-2 m-1  px-4"
            onPress={() => router.push('/register')}
          >
            <Text className="text-white font-semibold">Register</Text>
          </TouchableOpacity>
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
