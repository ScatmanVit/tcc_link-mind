import { client_db } from "./client-db.js";

export async function updateEventStatus(eventId, userId, status) {
    try {
        const query = `
            UPDATE eventos
            SET statusNotification = $1,
                updated_at = NOW()
            WHERE id = $2 AND userId = $3
            RETURNING *;
        `

        const result = await client_db.query(query, [status, eventId, userId])

        return {
            success: true,
            data: result.rows[0] || null
        }
    } catch (err) {
        console.error("Erro ao atualizar evento ", err);
        return {
            success: false,
            error: err.message
        }
    }
}
