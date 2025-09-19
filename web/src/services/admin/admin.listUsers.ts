import axios from 'axios'

export default async function list_Users(page: string, limit: string, access_token: string) {
	try {
		const res = await axios.get("http://localhost:3000/api/v1/linkmind/admin/list-users", {
			params: {
				page,
				limit
			},
			headers: {
				Authorization: `${access_token}`
			}
		});
		if (res.data?.error) {
			throw new Error(res.data.error || "Erro ao listar usuários");
		}
		return res.data;
	} catch (err: any) {
		if (err.response) {
			throw new Error(err.response.data.error || "Erro ao listar usuários.");
		}
		throw new Error("Erro desconhecido.");
	}
}