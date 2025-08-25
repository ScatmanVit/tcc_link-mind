import { Tabs } from 'expo-router'
import { colors } from '@/src/styles/colors'
import { Ionicons } from '@expo/vector-icons'

export default function TabsLayout(){
   return (
      <Tabs
         screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.green[300],
            tabBarInactiveTintColor: colors.gray[400],
         }}
      >
         <Tabs.Screen
            name="home"
            options={{
               title: "home",
               tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home-outline" color={color} size={size}/>
               )
            }}
         />
         <Tabs.Screen
            name="compras"
            options={{
               title: "compras",
               tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home-outline" color={color} size={size}/>
               )
            }}
         />
         <Tabs.Screen
            name="eventos"
            options={{
               title: "eventos",
               tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home-outline" color={color} size={size}/>
               )
            }}
         />
      </Tabs>
   )
}  