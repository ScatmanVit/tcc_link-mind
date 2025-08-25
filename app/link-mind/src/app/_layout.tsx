import { Stack } from 'expo-router';
import AuthProvider from '@/src/context/auth';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: true,
        }}
      />
    </AuthProvider>
  );
}
