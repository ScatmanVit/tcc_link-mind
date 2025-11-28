import { updateEventStatus } from './update-event-status.js';
import { checkStatusEvent } from './check-status-event.js';
import { sendNotification } from './send-notification.js'; 

export const handler = async (event) => {
    try {
        const sqs_payload = JSON.parse(event.Records[0].body);

        const {
            idUser,
            eventId,
            bodyMessage,
            titleMessage
        } = sqs_payload;

        console.log("DATA", sqs_payload)
        const statusData = await checkStatusEvent(eventId, idUser);

        if (!statusData?.success) {
            console.log("Falha ao verificar status do evento ");
            return
        }
        console.log("STATUS EVENTO", statusData.data)
		if (!statusData.data?.statusNotification) {
			console.log("Evento sem statusNotification")
		}
        
        const currentStatus = statusData.data.statusNotification.toUpperCase();
        console.log("Status atual do evento ", currentStatus);

        if (currentStatus === "SENT") {
            console.log("Evento já enviado anteriormente. Ignorando ");
            return
        }

        if (currentStatus !== "SCHEDULED") {
            console.log("Status não é SCHEDULED. Nada a fazer ");
            return
        }
        console.log("Enviando notificação...");
        
        const resNotification = await sendNotification({
            eventId,
            idUser,
            title: titleMessage,
            body: bodyMessage
        })

        if (!resNotification.success) {
            console.error("Falha ao enviar notificação.");
            await updateEventStatus(eventId, idUser, "FAILED");
            return
        }

        await updateEventStatus(eventId, idUser, "SENT");
        console.log("Notificação enviada e status do evento atualizado para SENT ");
        return

    } catch (err) {
        console.error("Erro inesperado no handler ", err);
        return
    }
}
