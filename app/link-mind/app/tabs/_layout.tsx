import { Image, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tabs, usePathname, useRouter, useLocalSearchParams } from 'expo-router';
import { useContext, useState, useRef, useEffect } from 'react';
import { ToastProvider } from 'react-native-toast-notifications';


import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ArrowLeft } from "lucide-react-native";
import { Ionicons } from '@expo/vector-icons';
import Octicons from '@expo/vector-icons/Octicons';

import { AuthContext } from '../../src/context/auth';
import { colors } from '@/styles/colors';
import ItemSelector from '@/src/components/itemSelector';
import OptionsModal from '@/src/components/modals/optionsModal';
import { StatusBar } from 'expo-status-bar';
import { handleDailyExpoTokenRegister } from '@/src/services/device-token/expoTokenManager';

export default function TabLayout() {
	const { user } = useContext(AuthContext);
	
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useLocalSearchParams();

	const [ modalVisible, setModalVisible ] = useState<boolean>(false)


	const baseRoutes = ["links", "anotacoes", "eventos", "pesquisa"];
	const subRoutes = ["add-link", "add-event", "add-note", "annotations-actions"]

	const isSubRoute = subRoutes.some((route) => pathname.includes(`/${route}`));

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
		switch (nameActionPage){
			case "add-link":
				return  "Criar novo Link"
			case "add-event": 
				return "Criar novo Evento"
			case "annotations-actions":
            	const isEditing = !!searchParams.id;
				if (isEditing) {
					return "Editar Anotação";
				} else {
					return "Criar nova Anotação";
				}
		}
	}

	function ChangeModalVisibility() {
        setModalVisible(prev => !prev) 
    }

	useEffect(() => {
		if (user?.access_token_prov) {
			handleDailyExpoTokenRegister(user.access_token_prov);
		}
	}, [user?.access_token_prov]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[950] }}>
			<StatusBar style="light" backgroundColor={colors.gray[950]} />
			<ToastProvider
				offset={10}   
				offsetTop={87}
				animationType="slide-in"
				swipeEnabled={false}
			>
				<OptionsModal 
					toggleVisible={ChangeModalVisibility} 
					isVisible={modalVisible}
				>
					<ItemSelector
						name="Novo Link"
						onPress={() => { 
							ChangeModalVisibility()
							setTimeout(() => {
								router.push('/tabs/links/add-link')
							}, 100)
						}}
					/> 
					<ItemSelector 
						name="Nova Anotação"
						onPress={() => {
							ChangeModalVisibility() 
							router.push('/tabs/anotacoes/annotations-actions')
						 }} 
					/>
					<ItemSelector 
						name="Novo Evento"
						onPress={() => { 
							ChangeModalVisibility()
							setTimeout(() => {
								router.push('/tabs/eventos/add-event')
							}, 100)
						}} 
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
						animation: "none",
						headerShown: false,
						tabBarShowLabel: true,
						tabBarInactiveTintColor: colors.gray[400],
						tabBarActiveTintColor: colors.green[300],
						tabBarStyle: isSubRoute
                            ? { display: 'none' } 
                            : { 
                                backgroundColor: colors.gray[900],
                                borderTopColor: colors.gray[800],
                                paddingTop: 9,
                                height: 95,
                                margin: -8,
                                marginBottom: -20,
                                borderTopLeftRadius: 25,
                                borderTopRightRadius: 25,
                        }
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
								<Octicons name="note" size={size} color={color} />
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
		height: 64,
		backgroundColor: colors.gray[950],
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: 6,
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
		borderWidth: 0.5,
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
		alignItems: "center",
		marginLeft: 3,
		gap: 10
	},
	nameActionPage: {
		marginLeft: 4,
		fontSize: 21,
		fontWeight: 600,
		color: colors.gray[50]
	}
});
