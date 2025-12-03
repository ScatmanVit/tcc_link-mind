import axios from 'axios'

export type UpdateEventProps = {
    access_token: string,
    eventId: string,
    data: {
        newTitle: string,
        newAddress?: string,
        newDate?: Date,
        newDescription?: string,
        newCategoriaId?: string
    }
} 

export default async function update_Event({ access_token, data, eventId }: UpdateEventProps) {
    if (!access_token) {
        console.error("TOKEN NÃO RECEBIDO")
        throw new Error("Token não recebido")
    }
    if (!eventId) {
        console.error("Id do evento não recebido")
        throw new Error("Id do evento não recebido")
    }
    try {
        const res = await axios.put(`https://tcc-link-mind.onrender.com/api/v1/linkmind/event/update/${eventId}`,
            data,
            { 
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        if (res.data?.success) {
            return {
                success: true,
                message: res.data.message,
                eventUpdated: res.data.eventUpdated
            }
        }
    } catch (err: any) {
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao editar evento"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido ao editar evento");
		} 
    }
}