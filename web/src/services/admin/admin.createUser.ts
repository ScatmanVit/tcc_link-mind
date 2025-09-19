import type { User } from '../../pages/UsersPage'
import axios from 'axios'

export type CreateUserResponse = {
	user: User;
	message: string;
};

export default async function createUser(
	dataUser: Partial<Omit<User, 'id'>>,
	access_token: string
): Promise<CreateUserResponse> {
	if (!dataUser) {
		throw new Error("Dados não recebidos, por favor preencha todos os campos");
	}

	try {
		const res = await axios.post(
			"http://localhost:3000/api/v1/linkmind/admin/create-user",
			dataUser,
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `${access_token}`
				}
			}
		);

		if (res.data.error) {
			throw new Error(res.data.error || "Não foi possível criar o usuário");
		}

		return {
			user: res.data.user as User,
			message: res.data.message as string
		};

	} catch (err: any) {
		if (err.response) {
			throw new Error(err.response.data?.error || "Erro ao criar usuário");
		}
		throw new Error(err.message || "Erro ao criar usuário");
	}
}
