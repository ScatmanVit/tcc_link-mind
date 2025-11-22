import axios from 'axios'

export type CreateLinkProps = {
    title: string,
    link: string,
    description?: string,
    categoriaId?: string,
    estadoId?: string,
    notification?: boolean,
    summary_link?: boolean
}

export default async function create_Link(access_token: string, data: CreateLinkProps) {
    if (!access_token) {
        console.log("TOKEN NÃO RECEBIDO")
        throw new Error("Token não recebido")
    }
    try {
        const res = await axios.post("https://tcc-link-mind.onrender.com/api/v1/linkmind/link/create", 
        data,
        { 
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }
    )
        if (res.data?.success) {
            return {
                success: true,
                message: res.data.message,
            }
        }
        console.log(res.data)
    } catch(err: any) {
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao criar o novo link"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido ao criar o novo link");
		}
    }
}
