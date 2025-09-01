import PrivateUserService from '../../../../services/private/user/links/private.links.user.service.js'
import { findOneUser } from '../../../../utils/utils.js'
import dotenv from 'dotenv'
dotenv.config()


async function links_create_Controller_POST(req, res) {
	const userId = req.user?.id

	try {
		if (!userId) {
			return res.status(401).json({
				error: "Usuário não autenticado. Token inválido ou ausente."
			})
		}

		const userExist = await findOneUser("", userId)
		if (!userExist) {
			return res.status(404).json({
				error: "Usuário não encontrado. Não é possível criar link."
			})
		}
		const { 
			title, 
			link, 
			description, 
			categoriaId,
			estadoId, 
			notification, 
			tagsRelacionadas 
		} = req.body
		if (!title || !link) {
			return res.status(400).json({
				error: "Campos obrigatórios não fornecidos."
			})
		}
		const newLink = await PrivateUserService.links_CREATE({
			title,
			link,
			description,
			categoriaId,
			estadoId,
			idUser: userId,
			notification,
			tagsRelacionadas,
		})

		if (newLink?.error) {
			return res.status(400).json({ error: newLink.error })
		}

		return res.status(201).json({
			success: true,
			message: "Link criado com sucesso!",
			link: newLink
		})
	} catch (err) {
		console.error("Erro no servidor, [ CRIAÇÃO LINK ]", err)
		return res.status(500).json({
			error: "Ocorreu um erro no servidor ao criar o link."
		})
	}
}


async function links_delete_Controller_DELETE(req, res) {
	const linkId = req.params.id
	const idUser = req.user?.id

	try {
		if (!linkId || !idUser) {
			return res.status(400).json({
				message: "Id do link e do usuário não foram fornecidos"
			})
		}
		const userExist = await findOneUser("", idUser)
		if (!userExist) {
			return res.status(404).json({
				error: "Não existe usuário com esse ID para o link."
			})
		}

		const linkDeleted = await PrivateUserService.link_DELETE(linkId, idUser)

		if (linkDeleted.error) {
			return res.status(400).json({
				error: linkDeleted.error
			})
		}
		if (linkDeleted) {
			return res.status(200).json({
				success: true,
				message: "Link deletado com sucesso!"
			})
		} else {
			return res.status(404).json({
				success: false,
				message: "Link não encontrado"
			})
		}
	} catch (err) {
		console.error("Ocorreu um erro no servidor [ DELETE LINK ]", err)
		return res.status(500).json({
			error: "Ocorreu um erro no servidor"
		})
	}
}


async function links_update_Controller_UPDATE(req, res) {
	const userId = req.user?.id
	const idLink = req.params?.id
	const {
		newLink,
		newName,
		newDescription,
		newCategory,
		newEstadoId,
		newTagsRelacionadas,
		newNotification
	} = req.body
	if (!userId || !idLink) {
		return res.status(400).json({
			error: "Id no usuário ou do link não fornecidos"
		})
	}

	try {
		const linkUpdated = await PrivateUserService.links_UPDATE({
			idUser: userId,
			idLink: idLink,
			newLink,
			newName,
			newDescription,
			newCategory,
			newEstadoId,
			newTagsRelacionadas,
			newNotification
		})
		if (linkUpdated.error) {
			return res.status(400).json({
				message: linkUpdated.error
			})
		}
		return res.status(200).json({
			success: true, 
			message: "Seu link foi alterado com sucesso!"
		})
	} catch (err) {
		console.error("Ocorreu um erro no servidor, [ UPDATE LINK  ]", err)
		return res.status(500).json({
			error: "Ocorreu um erro no servidor."
		})
	}
}

async function links_list_Controller_GET(req, res) {
	const userId = req.user?.id

	try {
		if (!userId) return res.status(401).json({
			error: "ID Token não fornecido no token."
		})
		const userExist = await findOneUser("", userId)
		if (!userExist) {
			return res.status(401).json({
				error: "Não existe usuário com esse ID para listar os Links."
			})
		}
		const linksUser = await PrivateUserService.links_LIST(userId)
		if (linksUser?.error) {
			return res.status(400).json({
				error: linksUser.error
			})
		}

		return res.status(200).json({
			success: true,
			message: "Links do usuário obtidos com sucesso!", linksUser
		})
	} catch (err) {
		console.error("Erro no servidor, [ LISTAGEM LINKS ]", err)
		return res.status(500).json({
			error: "Ocorreu um erro no servidor."
		})
	}
}

export default {
	links_create_Controller_POST,
	links_list_Controller_GET,
	links_delete_Controller_DELETE,
	links_update_Controller_UPDATE
}