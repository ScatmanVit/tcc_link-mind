import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '@/styles/colors' // ajuste o caminho do seu arquivo de cores

export default function TabLayout() {
  return (
   
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // 🔥 Esconde os nomes das telas
        tabBarActiveTintColor: colors.green[300],
        tabBarStyle: {
          backgroundColor: colors.gray[900],
          borderTopColor: colors.gray[100],
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="links"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? colors.gray[700]  : 'transparent',
                padding: 12,
              }}
            >
              <Ionicons name="link" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="compras"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? colors.gray[700] : 'transparent',
                padding: 12,
              }}
            >
              <Ionicons name="bag-sharp" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="eventos"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? colors.gray[700] : 'transparent',
                padding: 12,
              }}
            >
              <Ionicons name="calendar-sharp" size={size} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>

  );
}
