import axios from 'axios'

type SummaryLinkProps = {
    data: {
        linkUrl: string,
        linkType: string,
        linkId: string,
        instructionsFromUser: string
    },
    access_token: string
}

export default async function link_Summary({
    data,
    access_token
}: SummaryLinkProps) {
    if (!access_token) {
        console.error("TOKEN NÃO RECEBIDO")
        throw new Error("Token não recebido")
    }
    try {
        const res = await axios.post('https://tcc-link-mind.onrender.com/api/v1/linkmind/summary/link', 
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
                summary: res.data.summary
            }
        }
    } catch (err: any) {
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao resumir link"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido ao resumir link.");
		}
    } 
}   