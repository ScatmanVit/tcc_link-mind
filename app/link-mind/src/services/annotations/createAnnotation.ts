import { AnnotationProps } from '@/src/components/annotations/annotation'
import axios from 'axios'

export type CreateAnnotationProps = {
    access_token: string,
    data: Omit<AnnotationProps, "id">
}

export default async function create_Annotation({access_token, data}: CreateAnnotationProps) {
    if (!access_token) {
        console.error("TOKEN NÃO RECEBIDO")
        throw new Error("Token não recebido")
    }
    try {
        console.log('SERVICE', data)
        const res = await axios.post('https://tcc-link-mind.onrender.com/api/v1/linkmind/annotation/create',
            data,
            { 
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
        })
        if (res.data?.success) {
            return {
                success: true,
                message: res.data.message,
                annotationCreated: res.data.annotationCreated
            }
        }
    } catch (err: any) {
        console.log(err)
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao criar anotação"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido ao criar anotação");
		}
    }
}