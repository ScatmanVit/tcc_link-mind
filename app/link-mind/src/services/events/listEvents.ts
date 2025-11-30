import axios from 'axios'

export default async function list_Events(access_token: string) {
    if (!access_token) {
        console.log("TOKEN NÃO RECEBIDO")
        throw new Error("Token não recebido")
    } 
    try {
        const res = await axios.get("https://tcc-link-mind.onrender.com/api/v1/linkmind/event/list", {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
        if (res.data?.success) {
            return {
                message: res.data.message,
                events: res.data.events
            }
        }
    } catch (err: any) {
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao buscar eventos"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido ao buscar eventos");
		}
    }
}