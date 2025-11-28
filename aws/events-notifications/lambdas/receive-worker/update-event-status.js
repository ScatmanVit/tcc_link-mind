import { pool } from "./client-db.js"

export async function updateEventStatus(eventId, userId, status) {
    try {
        const query = `
            UPDATE "Evento"
            SET "statusNotification" = $1
            WHERE id = $2 AND "userId" = $3
            RETURNING *;
        `

        const result = await pool.query(query, [status, eventId, userId])

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
