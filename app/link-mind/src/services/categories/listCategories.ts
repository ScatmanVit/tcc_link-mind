import axios from 'axios'

export default async function categories_List(access_token: string) {
    try {
        const res = await axios.get("http://localhost:3000/api/v1/linkmind/categories/list", 
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        if (res.data?.success) {
            return {
                message: res.data.message,
                categories: res.data.categories
            }
        }
    } catch(err: any) {
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao buscar categorias"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido ao buscar categorias");
		}
    }
}