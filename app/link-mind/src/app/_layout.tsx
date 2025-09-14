import { Stack } from 'expo-router';
import AuthProvider from '@/src/context/auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<AuthProvider>
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				/>
			</AuthProvider>
		</SafeAreaProvider>

	);
}
