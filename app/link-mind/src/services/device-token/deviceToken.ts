import axios from 'axios'

export default async function deviceToken_register(expo_token: string, access_token: string){
    if (!expo_token) {
        console.log("EXPO TOKEN NÃO RECEBIDO")
        throw new Error("Expo Token não recebido.")
    }
    try {
        const res = await axios.post('https://tcc-link-mind.onrender.com/api/v1/linkmind/user/device-token', 
        { EXPO_DEVICE_TOKEN: expo_token },
        { 
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
        if (res.data?.success) {
            return {
                message: res.data.message
            }
        }
    } catch (err: any) {
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao registrar o token."
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido registrar o token.");
		}
    }
}