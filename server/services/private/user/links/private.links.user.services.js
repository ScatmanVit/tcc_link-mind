import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function links_CREATE(dataNewLink) {
	const {
		title,
		link,
		description,
		categoriaId,
		estadoId,
		idUser,
		notification,
		tagsRelacionadas
	} = dataNewLink

	if (!idUser) {
		return { 
			statusCode: 400,
			error: "Id do usuário não fornecido para a criação do novo link" 
		}
	}
	try {
		const data = {
			title,
			link,
			userId: idUser,
			description: description || null,
			notification: notification || null,
		}
		if (categoriaId) data.categoriaId = categoriaId
		if (estadoId) data.estadoId = estadoId
		if (tagsRelacionadas && tagsRelacionadas.length) {
			data.tagRelacionadas = {
				connect: tagsRelacionadas.map(id => ({ id }))
			}
		}
		const newLink = await prisma.link.create({ data })
		return newLink
	} catch (err) {
		console.error(err)
		return {
			error: "Não foi possível criar o novo link"
		}
	}
}

async function link_DELETE(idLink, idUser) {
	if (!idLink || !idUser) {
		return {
			statusCode: 400,
			error: "Id do link ou do usuário não fornecidos para deletar o link."
		}
	}
	try {
		const linkDeleted = await prisma.link.deleteMany({
			where: {
				userId: idUser,
				id: idLink
			}
		})
		if (linkDeleted.count === 0) {
			return {
				error: "O link não foi deletado"
			}
		}
		return linkDeleted.count > 0
	} catch (err) {
		console.error(err)
		return {
			error: "Não foi possível deletar o link"
		}
	}
}


async function links_UPDATE(dataUptdatedink) {
	const {
		idUser,
		idLink,
		newLink,
		newName,
		newDescription,
		newCategory,
		newEstadoId,
		newTagsRelacionadas,
		newNotification
	} = dataUptdatedink

	if (!idUser || !idLink) {
		return {
			error: "Id do usuário ou link não fornecido para alterar o link do usuário"
		}
	}
	try {
		const newLinkData = Object.fromEntries(
			Object.entries({
				title: newName,
				link: newLink,
				description: newDescription,
				categoriaId: newCategory,
				estadoId: newEstadoId,
				tagsRelacionadas: newTagsRelacionadas,
				notification: newNotification,
			}).filter(([_, value]) => value != null && value !== "")
		);

		const linkUpdated = await prisma.link.update({
			where: {
				userId: idUser,
				id: idLink
			},
			data: newLinkData
		})
		return linkUpdated
	} catch (err) {
		if (err.code === 'P2025') {
			return { 
				error: "O link que você tentou alterar não existe",
				statusCode: 404
			}
		}
		console.error(err)
		return {
			error: "Não possível alterar o link"
		}
	}
}

async function links_LIST(idUser) {
	if (!idUser) {
		return {
			error: "Id do usuário não fornecido para busca dos links do usuário",
			statusCode: 400
		}
	}
	try {
		const links = await prisma.link.findMany({
			where: {
				userId: idUser
			}
		})
		return links
	} catch(err) {
		console.error(err)
		return {
			error: "Não foi possível buscar links do usuário"
		}
	}
}

export default {
	links_LIST,
	links_CREATE,
	link_DELETE,
	links_UPDATE
}