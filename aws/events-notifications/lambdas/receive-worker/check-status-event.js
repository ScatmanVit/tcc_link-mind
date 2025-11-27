import { client_db } from "./client-db.js"

export async function checkStatusEvent(eventId, userId) {
    try {
        const query = `
            SELECT statusNotification
            FROM eventos
            WHERE id = $1 AND userId = $2
        `
        const result = await client_db.query(query, [eventId, userId])

        return {
            success: true,
            data: result.rows[0] || null
        }
    } catch (err) {
        console.error("Erro ao verificar status do evento ", err)
        return {
            error: err.message
        }
    }
}