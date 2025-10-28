import { Image, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { useContext, useState, useRef } from 'react';
import { ToastProvider } from 'react-native-toast-notifications';


import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ArrowLeft } from "lucide-react-native";
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../../src/context/auth';
import { colors } from '@/styles/colors';
import ItemSelector from '@/src/components/itemSelector';
import OptionsModal from '@/src/components/modals/optionsModal';

export default function TabLayout() {
	const { user } = useContext(AuthContext);
	
	const router = useRouter();
	const pathname = usePathname();
	
	const [modalVisible, setModalVisible] = useState<boolean>(false)


	const baseRoutes = ["links", "anotacoes", "eventos", "pesquisa"];
	const subRoutes = ["add-link"]
	function handleArrowBack() {
		const activeBase = baseRoutes.find((route) =>
			pathname.includes(`/${route}/`)
		);
		const backRoute = activeBase ? `/tabs/${activeBase}` : "/tabs/links";
		router.push(backRoute as any);
		console.log(pathname)
	}

	const shouldShowArrow = baseRoutes.some((route) =>
		pathname.includes(`/${route}/`)
	);

	function nameActionPage() {
		const nameActionPage = subRoutes.find((route: string) =>
			pathname.includes(`/${route}`)
		);
		console.log(nameActionPage)
		if (nameActionPage === "add-link") return "Criar novo link"
		// conmtinuar para as demais páginas
	}

	function ChangeModalVisibility() {
        setModalVisible(prev => !prev) 
    }
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ToastProvider>
				<OptionsModal 
					toggleVisible={ChangeModalVisibility} 
					isVisible={modalVisible}
				>
					<ItemSelector
						name="Novo Link"
						onPress={() => { 
							router.push('/tabs/links/add-link')
							ChangeModalVisibility()
						}}
					/>
					<ItemSelector 
						name="Nova Anotação"
						onPress={() => { }} 
					/>
					<ItemSelector 
						name="Novo Evento"
						onPress={() => { }} 
					/>
				</OptionsModal>
				<View style={style.header}>
					<View style={style.header_left}>
						{shouldShowArrow ? (
							<View style={style.viewNameActionPage}>
								<ArrowLeft
									size={24}
									color="#fff"
									onPress={handleArrowBack}
								/>
								<Text style={style.nameActionPage}>
									{nameActionPage()}
								</Text> 
							</View>
						) : 
							<Image
								style={style.icon}
								source={require("../../assets/images/icon.png")}
							/>
						}
					</View>

					<View style={style.header_right}>

						<View style={style.buttonSearch}>					
							<TouchableOpacity onPress={() => router.push("/pesquisa")} activeOpacity={0.7}>
								<FontAwesome6
									style={style.buttonAdd}
									name="magnifying-glass"
									size={20}
									color={colors.green[200]}
								/>
							</TouchableOpacity>
						</View>	
						<TouchableOpacity onPress={ChangeModalVisibility} activeOpacity={0.7}>
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
			</ToastProvider>
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
		width: 22
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
	viewNameActionPage: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 10
	},
	nameActionPage: {
		fontSize: 15,
		color: colors.gray[50]
	}
});
