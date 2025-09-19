import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function create_Admin_service_CREATE(data) {
    if (!data) {
        return {
            error: "Dados não recebidos para cadastro."
        }
    }
    try {
        const userCreated = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role,
                status: data.status
            }
        })
        if(!userCreated) {
            return {
                error: "O usuário não foi criado",
                statusCode: 500
            }
        }
        return userCreated
    } catch (err) {
        console.error(err)
        return { 
            error: "Não foi possível criar o usuário.",
            statusCode: 500
        }
    }
}

async function list_Admin_Service_LIST(page, limit) {
    async function pagination_Users(page, limit) {
        const skip = (page - 1) * limit

        const users = await prisma.user.findMany({
            skip: skip,
            take: limit,
            orderBy: { id: "asc" }
        })
        return users
    }
    try {
        const users = await pagination_Users(page, limit)
        if (users.count === 0) {
            return {
                error: "Não existem usuários para listar",
                statusCode: 404
            }
        }
        return users   
    } catch (err) {
        console.error(err)
        return {
            error: "Não foi possível listar os usuários",
            statusCode: 500
        }
    }
}

async function delete_Admin_Service_DELETE(idUser) {
    if (!idUser) {
        return {
            error: "O Id do usuário não foi fornecido.",
            statusCode: 400
        }
    }
    try {
        const userDeleted = await prisma.user.deleteMany({
            where: {
                id: idUser
            }
        })
        if (userDeleted.count === 0) {
            return {
                error: "O usuário não foi deletado",
                statusCode: 500
            }
        } 
        return userDeleted.count > 0
    } catch(err) {
        console.error(err)
        return { 
            error: "Não foi possível deletar o usuário",
            statuCode: 500
        }
    }
}

async function update_Admin_service_UPDATE(newData) {
    if (!newData || !newData.id) {
        return {
            error: "Dados não recebido para alteração no usuário",
            statusCode: 400
        }
    }
    try {
        const newDataUser = Object.fromEntries(
			Object.entries({
                name: newData.name,
                email: newData.email,
                password: newData.password,
                role: newData.role,
                status: newData.status
			}).filter(
                ([_, value]) => 
                    value !== null && value !== undefined && value !== ""
            )
		);
        const userUpdated = await prisma.user.update({
            where: {
                id: newData.id
            },
            data: newDataUser
        })
        if (!userUpdated) {
            return {
                error: "Não foi possível alterar o usuário",
                statusCode: 500
            }
        }
        return userUpdated
    } catch (err) {
		console.error(err)
        if (err.code === 'P2025') {
			return { 
				error: "O link que você tentou alterar não existe",
				statusCode: 404
			}
		}
        return {
            error: "Não foi possível alterar o usuário.",
            statusCode: 500
        }
    }
}

export default {
    create_Admin_service_CREATE,
    delete_Admin_Service_DELETE,
    update_Admin_service_UPDATE,
    list_Admin_Service_LIST
} 