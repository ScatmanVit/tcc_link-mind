import axios from "axios";

type deleteLinkProps = {
    access_token: string,
    id_link: string
}
 
export default async function delete_Link({ access_token, id_link }: deleteLinkProps) {
    if (!id_link) {
        console.log("ID DO LINK NÃO RECEBIDO")
        console.log("ID LINK: ", id_link)
    }
    try {
        const res = await axios.post(`https://tcc-link-mind.onrender.com/api/v1/linkmind/link/delete/${id_link}`,
            {}, 
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        if (res.data.success) {
            return { 
                message: res.data.message
            }
        }
    } catch(err: any) {
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao deletar o link"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido ao deletar o link");
		}
    }
}