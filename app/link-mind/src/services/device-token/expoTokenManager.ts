import AsyncStorage from "@react-native-async-storage/async-storage";
import deviceToken_register from "./deviceToken";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants"; 
import { Platform } from "react-native";


async function registerAndSave(token: string, access_token: string) {
    
    try {
        console.log("Tentando enviar para o backend...");
        const tokenRegistered = await deviceToken_register(token, access_token);
        
        if (tokenRegistered?.message) {
            console.log("Resposta do Back:", tokenRegistered.message);
        }

        
        const today = new Date().toISOString().split("T")[0];
        
        await AsyncStorage.setItem("EXPO_SAVED_TOKEN", token);
        await AsyncStorage.setItem("EXPO_TOKEN_LAST_REGISTER", today);

        console.log("Token salvo e registrado com SUCESSO ✔️");

    } catch (err: any) {
        console.log("❌ FALHA ao enviar pro backend. Não salvo localmente.");
        console.log(err.message);
    }
}

export async function handleDailyExpoTokenRegister(access_token: string) {
    try { 

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log("Usuário negou a permissão de notificação!");
            return;
        }

        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? "45742bc7-b70d-4e77-9116-c603aae096e7"
              

        if (!projectId) {
            console.log("ERRO CRÍTICO: Project ID não encontrado nem no código nem no config.");
            return;
        }

        const devicePushToken = await Notifications.getExpoPushTokenAsync({
            projectId: projectId, 
        });
        
        const currentToken = devicePushToken.data;

        if (!currentToken) {
            console.log("Nenhum Expo Push Token encontrado.");
            return;
        }

        const savedToken = await AsyncStorage.getItem("EXPO_SAVED_TOKEN");
        const lastRegisterDate = await AsyncStorage.getItem("EXPO_TOKEN_LAST_REGISTER");

        const today = new Date().toISOString().split("T")[0];

        if (savedToken && savedToken !== currentToken) {
            console.log("Token mudou. Registrando novo token...");
            await registerAndSave(currentToken, access_token);
        
            return;
        }

        if (!savedToken) {
            console.log("Primeiro registro. Registrando token...");
            await registerAndSave(currentToken, access_token);
            return;
        }

        if (lastRegisterDate === today) {
            console.log("Token já registrado hoje.");
            return;
        }

        console.log("Novo dia. Reenviando token por consistência.");
        await registerAndSave(currentToken, access_token);

    } catch (err: any) {
        console.log("Erro ao gerenciar token diário:", err);
    }
}