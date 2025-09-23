import type { User } from '../../pages/UsersPage'
import axios from 'axios'

export default async function updateUser(
    userUpdatedNew: Partial<Omit<User, "id">>,
    access_token: string,
    idUser: string
) {
    if (!access_token || !idUser) {
        throw new Error("Id do usuário ou access token não recebidos")
    }
    
    try {
        const userUpdated = await axios.put(
            `http://localhost:3000/api/v1/linkmind/admin/update-user/${idUser}`,
            {
                newName: userUpdatedNew.name,
                newEmail: userUpdatedNew.email,
                newPassword: userUpdatedNew.password,
                newRole: userUpdatedNew.role,
                newStatus: userUpdatedNew.status
            },
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        return userUpdated.data
    } catch (err: any) {
        if (err.response?.data?.error) {
            throw new Error(err.response.data.error)
        }
        throw new Error(err.message || "Erro desconhecido")
    }
}