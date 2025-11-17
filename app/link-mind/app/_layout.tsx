import { Stack } from 'expo-router';
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { colors } from '@/styles/colors'

import AuthProvider from '@/context/auth';

export type CategoryPropsItem = {
    nome: string;
    id: string;
};
 
const defaultCategories: CategoryPropsItem[] = [
    { id: '1', nome: 'Todas' },
    { id: '2', nome: "Sem categoria"},
    { id: '3', nome: 'Estudos' },
    { id: '4', nome: 'Trabalho' },
    { id: '5', nome: 'Finanças' },
    { id: '6', nome: 'Academia' },
    { id: '7', nome: 'Progresso' }
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

    useEffect(() => {
        initializeCategories();
    }, []);

    return (
        <SafeAreaProvider>
            <AuthProvider>
                <SafeAreaView style={{ flex: 1, paddingTop: -27, paddingBottom: -15 }}>
                    <StatusBar style="light" backgroundColor={colors.gray[950]} />
                    <Stack
                        screenOptions={{
                            headerShown: false,
                        }}
                    />
                </SafeAreaView>
            </AuthProvider>
        </SafeAreaProvider>

    );
}
