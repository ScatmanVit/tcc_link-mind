import { Expo } from "expo-server-sdk";
import { pool } from "./client-db.js";

const expo = new Expo();

export async function sendNotification({ eventId, idUser, title, body }) {
    try {
        const query = `
            SELECT token FROM "DeviceToken" WHERE "userId" = $1
        `
        const { rows } = await pool.query(query, [idUser])

        if (rows.length === 0) {
            console.log("Usuário não possui tokens salvos")
            return { success: false };
        }

        const tokens = rows.map(row => row.token)
        const validTokens = tokens.filter(token => Expo.isExpoPushToken(token))

        if (validTokens.length === 0) {
            console.log("Nenhum token válido encontrado")
            return { success: false }
        }

        const messages = validTokens.map(token => ({
            to: token,
            title,
            body,
            sound: "default",
            data: {
                sentAt: Date.now(),
                eventId,
                action: "open_event",
            android: { 
                    imageUrl: "https://i.postimg.cc/GTbmJTj0/icon.png"
                }            
            }
        }))

        const tickets = await expo.sendPushNotificationsAsync(messages)
        console.log("Tickets recebidos:", tickets)

        return { success: true, tickets }
    } catch (err) {
        console.error("Erro ao enviar notificação do evento ", err)
        return { success: false }
    }
}
