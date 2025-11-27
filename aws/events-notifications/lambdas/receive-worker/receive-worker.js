import { updateEventStatus } from './update-event-status.js';
import { checkStatusEvent } from './check-status-event.js';
import { createScheduleEventBridge } from './create-schedule-event-bridge.js';
import dotenv from 'dotenv';
dotenv.config();

export const handler = async (event) => {
	try {
		const sqs_payload = JSON.parse(event.Records[0].body);
		const {
			idUser,
			eventId,
			scheduleAt, 
			bodyMessage,
			titleMessage } = sqs_payload

		const statusData = await checkStatusEvent(eventId, idUser)
		if (!statusData.success) {
			console.error("Falha ao verificar status do evento")
			return
		}
		const currentStatus = statusData.data?.statusnotification.toUpperCase()
		console.log("Status atual do evento ", currentStatus)

		if (currentStatus === "SCHEDULED") {
			console.log("Evento já SCHEDULED. Nada a fazer.")
			return
		}

		const schedulePayload = { idUser, eventId, bodyMessage, titleMessage };
		const scheduleName = `event-${eventId}-${Date.now()}`

		try {
			const localDate = new Date(`${scheduleAt}:00`)
			const scheduleUTC = localDate.toISOString()

			await createScheduleEventBridge({
				scheduleName,
				dateTime: scheduleUTC,
				payload: schedulePayload
			});
			console.log("Schedule criado no EventBridge com sucesso")
		} catch (err) {
			console.error("Erro ao criar schedule no EventBridge:", err)
			return
		}

		const eventUpdated = await updateEventStatus(eventId, idUser, "SCHEDULED")
		if (!eventUpdated.success) {
			console.error("Falha ao atualizar status do evento")
			return
		}
		console.log("Status do evento atualizado para SCHEDULED", eventUpdated.data)

	} catch (err) {
		console.error("Erro inesperado no handler:", err)
	}
};
