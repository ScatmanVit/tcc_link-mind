import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '@/styles/colors'

export default function TabLayout() {
	return (

		<SafeAreaView style={{ flex: 1 }}>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarShowLabel: false,
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
							<View>
								<Ionicons name="link" size={size} color={color} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="compras"
					options={{
						tabBarIcon: ({ color, size, focused }) => (
							<View>
								<Ionicons name="bag-sharp" size={size} color={color} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="eventos"
					options={{
						tabBarIcon: ({ color, size, focused }) => (
							<View>
								<Ionicons name="calendar-sharp" size={size} color={color} />
							</View>
						),
					}}
				/>
			</Tabs>
		</SafeAreaView>


	);
}
