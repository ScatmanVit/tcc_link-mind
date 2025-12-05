import { Stack } from 'expo-router'

export default function AnotacoesStackLayout() {

  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
        <Stack.Screen name="index" />
    </Stack>
  )
}
