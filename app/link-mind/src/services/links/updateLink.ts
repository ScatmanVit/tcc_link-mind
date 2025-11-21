import axios from 'axios'

export type UpdateLinkProps = {
    newLink?: string,
    newTitle?: string,
    newDescription?: string,
    newCategoryId?: string,
    newEstadoId?: string,
    newNotification?: boolean
}

export default async function update_Link(
    idLink: string | undefined, 
    access_token: string, 
    data: UpdateLinkProps
){
    if (!access_token){
        console.log("TOKEN NÃO RECEBIDO")
        throw new Error("Token não recebido")
    }
    try {
        const res = await axios.put(
            `https://tcc-link-mind.onrender.com/api/v1/linkmind/link/update/${idLink}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        console.log(res.data)
        if(res?.data.message) {
            return {
                message: res.data.message,
                linkUpdated: res?.data.linkUpdated
            }
        }
    } catch(err: any) {
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao alterar o link"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido ao alterar o link");
		}
    }
}