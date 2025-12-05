import axios from 'axios'


export default async function list_Annotations(access_token: string) {
    if (!access_token) {
        console.error("TOKEN NÃO RECEBIDO")
        throw new Error("Token não recebido")
    }
    try {
        const res = await axios.get('https://tcc-link-mind.onrender.com/api/v1/linkmind/annotation/list', {
                headers: {
                    Authorization: `Bearer ${access_token}` 
                }
            })
        if (res.data?.success) {
            return {
                success: true,
                message: res.data.message,
                annotations: res.data.annotations
            }
        }
    } catch (err: any) {
        console.log(err)
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao buscar anotações"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido ao buscar anotações");
		}
    }
}
