import { Stack } from 'expo-router'

export default function AnotacoesStackLayout() {

  return (
    <Stack screenOptions={{
      headerShown: false,
      animation: "fade_from_bottom",
      animationDuration: 0.5
    }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="annotations-actions" />
    </Stack>
  )
}
