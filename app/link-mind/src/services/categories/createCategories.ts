import axios from 'axios'
import type { CategoryPropsItem } from '../../../app/index'


export default async function category_Create(access_token: string, dataNewCategory: CategoryPropsItem[]) {
    if (!access_token || !dataNewCategory) {
        console.log("TOKEN OU NOVAS CATEGORIAS NÃO RECEBIDAS")
        console.log("TOKEN: ", access_token)
        console.log("CATEGORIAS NOVAS: ", dataNewCategory)
    }
    try {
        const res = await axios.post("http://localhost:3000/api/v1/linkmind/category/create", 
            { dataNewCategory },
            {
                headers:  {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        if (res.data?.success) {
            return {
                message: res.data.message
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