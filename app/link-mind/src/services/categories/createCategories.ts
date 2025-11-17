import axios from 'axios'
import type { CategoryPropsItem } from '../../../app/_layout'

export default async function category_Create(access_token: string, dataNewCategory: CategoryPropsItem[]) {
    if (!dataNewCategory) {
        console.log("NOVAS CATEGORIAS NÃO RECEBIDAS")
        console.log("CATEGORIAS NOVAS: ", dataNewCategory)
    }
    try {
        const res = await axios.post("https://tcc-link-mind.onrender.com/api/v1/linkmind/category/create", 
            { dataNewCategory },
            {
                headers:  {
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
                "Ocorreu um criar categoria"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido ao criar categorias");
		}
    }
}