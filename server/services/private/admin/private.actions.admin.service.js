import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

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

export default {
    delete_Admin_Service_DELETE,
    list_Admin_Service_LIST
}