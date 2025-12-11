import { Stack } from 'expo-router';
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Text } from "react-native";
import { colors } from '@/styles/colors'
import * as Notifications from "expo-notifications";


import AuthProvider from '@/context/auth';

export type CategoryPropsItem = {
    nome: string;
    id: string;
};

const defaultCategories: CategoryPropsItem[] = [
    { id: '1', nome: 'Todas' },
    { id: '2', nome: "Sem categoria" },
    { id: '3', nome: 'Estudos' },
    { id: '4', nome: 'Trabalho' },
    { id: '5', nome: 'Finanças' },
    { id: '6', nome: 'Academia' },
    { id: '7', nome: 'Progresso' },
    { id: '8', nome: "Expirado" }
];

export const STORAGE_KEY = '@categories';
export const FLAG_KEY = '@categoriesSynced';

async function initializeCategories() {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY)
        if (!stored) {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories))
            await AsyncStorage.setItem(FLAG_KEY, JSON.stringify(true))
            console.log('Categorias locais criadas no AsyncStorage')
        } else {
            console.log('ℹCategorias locais já existem')
        }
    } catch (err: any) {
        console.error('Erro ao inicializar categorias:', err)
    }
}

export default function RootLayout() {


    const [fontsLoaded] = useFonts({
        Roboto: require("../assets/fonts/Roboto-Regular.ttf"),
        RobotoItalic: require("../assets/fonts/Roboto-Italic-VariableFont_wdth,wght.ttf"),
    });

    useEffect(() => {
        initializeCategories();
    }, []);

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });

    if (fontsLoaded) {
        (Text as any).defaultProps = (Text as any).defaultProps || {};
        (Text as any).defaultProps.style = { fontFamily: "Roboto" };
    }

    if (!fontsLoaded) {
        return (
            <SafeAreaProvider>
                <SafeAreaView />
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <AuthProvider>
                <SafeAreaView style={{ flex: 1, paddingTop: -27, paddingBottom: -10, backgroundColor: colors.gray[950] }}>
                    <StatusBar style="light" backgroundColor={colors.gray[950]} />
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            animation: "none"
                        }}
                    />
                </SafeAreaView>
            </AuthProvider>
        </SafeAreaProvider>

    );
}
