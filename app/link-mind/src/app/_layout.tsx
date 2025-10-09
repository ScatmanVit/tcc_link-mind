import { Stack } from 'expo-router';
import { StatusBar } from "expo-status-bar"
import AuthProvider from '@/src/context/auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<AuthProvider>
				<StatusBar style="light" backgroundColor="black" />
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				/>
			</AuthProvider>
		</SafeAreaProvider>

	);
}
