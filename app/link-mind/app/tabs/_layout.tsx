import { Image, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { useContext } from 'react';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ArrowLeft } from "lucide-react-native";
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../../src/context/auth';
import { colors } from '@/styles/colors';
import Input from '@/src/components/input';

export default function TabLayout() {
	const { user } = useContext(AuthContext);
	
	const router = useRouter();
  	const pathname = usePathname();

	const baseRoutes = ["links", "anotacoes", "eventos", "pesquisa"];

	function handleArrowBack() {
		const activeBase = baseRoutes.find((route) =>
			pathname.includes(`/${route}/`)
		);
		const backRoute = activeBase ? `/tabs/${activeBase}` : "/tabs/links";
		router.push(backRoute as any);
	}

	const shouldShowArrow = baseRoutes.some((route) =>
		pathname.includes(`/${route}/`)
	);
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={style.header}>
				<View style={style.header_left}>
					{shouldShowArrow && (
						<ArrowLeft
							size={24}
							color="#fff"
							onPress={handleArrowBack}
						/>
					)}
					<Image
						style={style.icon}
						source={require("../../assets/images/icon.png")}
					/>
					<View style={style.buttonSearch}>					
						<TouchableOpacity onPress={() => router.push("/pesquisa")} activeOpacity={0.7}>
							<Input
								placeholder="Pesquise links, notas ou eventos..."
								placeholderTextColor={colors.gray[400]}
								radius={26}
								size={15}
							/>
						</TouchableOpacity>
					</View>	
				</View>

				<View style={style.header_right}>

					<TouchableOpacity activeOpacity={0.7}>
						<FontAwesome6
							style={style.buttonAdd}
							name="add"
							size={22}
							color={colors.green[200]}
						/>
					</TouchableOpacity>

					<TouchableOpacity activeOpacity={0.8}>
						<View style={style.photo_profile}>
							<Text style={style.profile_text}>{user?.email ? user.email[0].toUpperCase() : "?"}</Text>
						</View>
					</TouchableOpacity>
				</View>
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
							<Ionicons name="link" size={size} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="anotacoes"
					options={{
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="bag-sharp" size={size} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="eventos"
					options={{
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="calendar-sharp" size={size} color={color} />
						),
					}}
				/>
			</Tabs>
		</SafeAreaView>
	);
}

const style = StyleSheet.create({
	header: {
		height: 73,
		backgroundColor: colors.gray[950],
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: 5,
		paddingHorizontal: 11,
	},
	header_left: {
		flexDirection: "row",
		alignItems: "center",
	},
	buttonSearch: {
		width: 225
	},
	header_right: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	photo_profile: {
		width: 37,
		height: 37,
		backgroundColor: colors.gray[800],
		borderRadius: 9999, 
		borderWidth: 1,
		borderColor: colors.gray[300],
		alignItems: "center",
		justifyContent: "center",
	},
	profile_text: {
		color: colors.gray[100],
		fontWeight: "bold",
		fontSize: 16,
	},
	icon: {
		width: 67,
		height: 67,
		marginLeft: -5,
	},
	buttonAdd: {
		marginRight: 5,
	},
});
