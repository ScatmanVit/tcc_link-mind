import { Stack } from 'expo-router'

export default function AnotacoesStackLayout() {

  return (
    <Stack screenOptions={{
      headerShown: false,
      animation: "fade_from_bottom"
    }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="annotations-actions" />
    </Stack>
  )
}
