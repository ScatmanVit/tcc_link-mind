import axios from 'axios'

export type CreateEventProps = {
    title: string,
    date?: string
    address?: string,
    scheduleAt?: string,
    description?: string,
    categoriaId?: string,
    statusNotification?: "PENDING"

}

export default async function create_Event(access_token: string, data: CreateEventProps) {
    if (!access_token) {
        console.error("TOKEN NÃO RECEBIDO")
        throw new Error("Token não recebido")
    }
    console.log(data)
    try {
        const res = await axios.post("https://tcc-link-mind.onrender.com/api/v1/linkmind/event/create", 
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
                eventCreated: res.data.eventCreated
            }
        }
    } catch (err: any) {
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao criar evento"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido ao criar evento");
		} 
    }
}