import axios from 'axios'

export default async function deleteUser(
    access_token: string, 
    idUser: string
) {
    if (!access_token || !idUser) {
        throw new Error("Id do usuário ou access token não recebidos")
    } 
    try {
        const userDeleted = await axios.delete(
            `http://localhost:3000/api/v1/linkmind/admin/delete-user/${idUser}`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${access_token}`
                }
            }
        );
        if (userDeleted.data.error) {
            throw new Error(userDeleted.data.error || "Falha ao tentar deletar usuário") 
        }
        return true
    } catch (err: any) {
        if (err.response) {
            console.error(err.response.data?.error || "Erro ao deletar usuário")
            throw new Error(err)
        }
        throw new Error(err.message || "Erro ao deletar usuário")
    }
}