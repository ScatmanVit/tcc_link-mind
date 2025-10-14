import axios from 'axios'

type emailSend = {
    name?: string,
    email: string,
    message: string,
    subject: string,
    access_token: string
}

export default async function emailSend({ name, email, message, subject, access_token }: emailSend) {
    if (!access_token) {
        console.error("Token não fornecido")
        throw new Error("Token não fornecido")
    }
    if (!email || !message || !subject) {
        console.error("Email ou mensagem ou subject não fornecidos")
        throw new Error("Email ou mensagem ou subject não fornecidos")
    } 
    try {
        const emailSend = await axios.post(
            "http://localhost:3000/api/v1/linkmind/admin/send-email-comunicate",
            { name, email, message, subject },
            {
                headers: {
                    Authorization: `${access_token}`
                }
            }
        )
        if (emailSend?.data?.success) {
            return { message: emailSend.data.message }
        } else {
            return { message: "Email enviado com sucesso para: ", email}
        }
    } catch (err: any) {
        if (err.response?.data?.error || err.response?.data?.error?.message) {
            throw new Error(
                err.response.data.error || 
                err.response.error.message || 
                "Ocorreu um erro ao enviar o email"
            )
		} else if (err instanceof Error) {
            throw err;
		} else {
			throw new Error("Erro desconhecido ao enviar o email");
		}
    }
}