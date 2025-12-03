import axios from 'axios'

type EventDeleteProps = {
    access_token: string,
    eventId: string
}

export default async function delete_Event({ access_token, eventId }: EventDeleteProps) {
    if (!access_token) {
        console.log("TOKEN NÃO RECEBIDO")
        throw new Error("Token não recebido")
    } 
    try {
        const res = await axios.delete(`https://tcc-link-mind.onrender.com/api/v1/linkmind/event/delete/${eventId}`, 
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        if (res.data?.success) {
            return {
                success: true,
                message: res.data.message
            }
        }
    } catch (err:any) {
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao deletar evento."
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido deletar evento.");
		}
    }
}