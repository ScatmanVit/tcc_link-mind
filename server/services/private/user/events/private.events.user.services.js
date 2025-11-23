import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

async function event_CREATE(newEvent, idUser) {
    if (!idUser) {
        return {
            statusCode: 400,
            error: "Id do usuário não fornecido para a criação do novo evento"
        }
    }

    try {
        const eventObj = {
            user: { connect: { id: idUser } },
            date: newEvent.date,
            title: newEvent.title,
            address: newEvent.address,
            expired: newEvent.expired,
            scheduleAt: newEvent.scheduleAt,
            categoriaId: newEvent.categoriaId,
            description: newEvent.description,
            notification: newEvent.notification,
            statusNotification: newEvent.statusNotification
        }

        for (const key in eventObj) {
            if (eventObj[key] == null || eventObj[key] === "") {
                delete eventObj[key]
            }
        }

        const eventCreated = await prisma.evento.create({
            data: eventObj
        })
        return eventCreated
    } catch (err) {
        console.log(err)
        return {
            error: "Não foi possível criar o evento."
        }
    }
}


async function event_LIST(idUser) {
    if (!idUser) {
        return {
            statusCode: 400,
            error: "Id do usuário não fornecido para a criação do novo evento"
        }
    }
    try {
        const eventsList = await prisma.evento.findMany({
            where: {
                userId: idUser
            }
        })
        return eventsList
    } catch (err) {
        console.error(err)
        return {
            error: "Não foi possível listar eventos do usuário."
        }
    }
}

async function event_DELETE(idUser, eventId) {
    if (!idUser) {
        return {
            statusCode: 400,
            error: "Id do usuário ou Evento não fornecido para a exclusão do evento"
        }
    }
    try {
        const eventDeleted = await prisma.evento.deleteMany({
            where: {
                id: eventId,
                userId: idUser
            }
        })
        if (eventDeleted.count === 0) {
            return {
                error: "O evento não foi alterado"
            }
        }
        return eventDeleted.count > 0
    } catch (err) {
        if (err.code === 'P2025') {
			return { 
				error: "O evento que você tentou deletar não existe",
				statusCode: 404
			}
		}
        console.error(err)
        return {
            error: "Não foi possível deletar o evento"
        }
    }
}


export default {
    event_CREATE,
    event_DELETE,
    event_LIST
}