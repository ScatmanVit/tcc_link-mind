import { Stack } from 'expo-router'

export default function LinksStackLayout() {

  return (
    <Stack screenOptions={{
      headerShown: false,
      animation: "fade_from_bottom",
      animationDuration: 0.5
    }}>
        <Stack.Screen name="add-link"  />
    </Stack> 
  )
}
