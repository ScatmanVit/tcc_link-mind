import axios from 'axios'

type DeleteAnnotationsProps = {
    annotationId: string,
    access_token: string
}

export default async function delete_Annotation({access_token, annotationId}: DeleteAnnotationsProps) {
    if (!access_token) {
        console.error("TOKEN NÃO RECEBIDO")
        throw new Error("Token não recebido")
    }
    try {
        const res = await axios.delete(`https://tcc-link-mind.onrender.com/api/v1/linkmind/annotation/delete/${annotationId}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        if (res.data?.success) {
            return {
                success: true,
                message: res.data.message
            }
        }
    } catch (err: any) {
        console.log(err)
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao deletar anotação"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido ao deletar anotação");
		}
    }
}