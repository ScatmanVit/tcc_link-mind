import axios from 'axios'

export default async function list_Links(access_token: string) {
    if (!access_token) {
        console.log("TOKEN NAO RECEBIDO")
        throw new Error("Token não recebido")
    }
    try {
        const res = await axios.get('http://localhost:3000/api/v1/linkmind/links/list', {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
        if (res?.data?.success) {
            return { 
                message: res.data.message ,
                links: res.data.linksUser
            }
        }
    } catch (err: any) {
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao buscar os links"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {

			throw new Error("Erro desconhecido ao enviar buscar os links");
		}
    }
} 