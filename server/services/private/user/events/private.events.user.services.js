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
    } catch(err) {
        console.log(err)
        return {
            error: "Não foi possível criar o evento."
        }
    }
}


export default {
    event_CREATE
}