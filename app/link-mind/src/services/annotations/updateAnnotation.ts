import axios from 'axios'


type UpdateAnnotationProps = {
    access_token: string,
    annotationId: string,
    dataNewAnnotation: {
        newTitle?: string,
        newAnnotation?: string,
        newCategoriaId?: string
    }
}

export default async function update_Annotation({ access_token, dataNewAnnotation, annotationId }: UpdateAnnotationProps) {
    if (!access_token) {
        console.error("TOKEN NÃO RECEBIDO")
        throw new Error("Token não recebido")
    }
    try {
        const res = await axios.put(`https://tcc-link-mind.onrender.com/api/v1/linkmind/annotation/update/${annotationId}`, 
            dataNewAnnotation,
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
                annotationUpdated: res.data.annotationUpdated
            }
        }
    } catch (err: any) {
        console.log(err)
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao editar anotação"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido ao editar anotação");
		}
    }
}