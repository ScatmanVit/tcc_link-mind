import { Stack } from 'expo-router'

export default function LinksStackLayout() {

  return (
    <Stack screenOptions={{
      headerShown: false,
      animation: "none"
    }}>
        <Stack.Screen name="add-link"  />
    </Stack> 
  )
}
