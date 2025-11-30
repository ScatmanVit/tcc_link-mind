import axios from 'axios'

export type NotificationEvent = {
    titleMessage: string,
    bodyMessage: string,
    scheduleAt: string,
    eventId: string
}

export default async function send_Notification_Event(
    access_token: string | undefined, 
    dataNotify: NotificationEvent
) {
    if (!access_token) {
        console.error("TOKEN NÃO RECEBIDO")
        throw new Error("Token não recebido")
    }
    try {
        const res = await axios.post(
            `https://tcc-link-mind.onrender.com/api/v1/linkmind/event/notification/${dataNotify.eventId}`, 
            dataNotify,
            { 
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        if(res.data?.success) {
            return {
                success: true,
                message: res.data.message
            }
        }
    } catch (err: any) {
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao agendar notificação do evento"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido ao agendar notificação do evento");
		} 
    }
}