import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '@/styles/colors'


export default function TabLayout() {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={style.header}>
				<Image style={style.icon} source={require("../../../assets/images/icon.png")} />
				<TouchableOpacity activeOpacity={0.7}>
					<FontAwesome6 style={style.buttonAdd} name="add" size={22} color={colors.green[200]} />
				</TouchableOpacity>
			</View>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarShowLabel: true,
					tabBarInactiveTintColor: colors.gray[400],
					tabBarActiveTintColor: colors.green[300],
					tabBarStyle: {
						backgroundColor: colors.gray[900],
						borderTopColor: colors.gray[700],
						paddingTop: 5,
						height: 60,
					},
				}}
			>
				<Tabs.Screen
					name="links"
					options={{
						tabBarIcon: ({ color, size }) => (
							<View>
								<Ionicons name="link" size={size} color={color} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="compras"
					options={{
						tabBarIcon: ({ color, size }) => (
							<View>
								<Ionicons name="bag-sharp" size={size} color={color} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="eventos"
					options={{
						tabBarIcon: ({ color, size }) => (
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

const style = StyleSheet.create({
	header: {
		height: 80,
		backgroundColor: colors.gray[950],
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderWidth: 1,
		padding: 18
	},
	icon: {
		width: 65,
		height: 65,
		marginLeft: -5
	},
	buttonAdd: {
		marginRight: 7
	}
})