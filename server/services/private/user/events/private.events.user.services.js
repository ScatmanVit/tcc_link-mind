import { PrismaClient } from "@prisma/client";
import { sendToQueue } from "../../../aws/sendJob_SQS.js";
import { Expo } from "expo-server-sdk";


const prisma = new PrismaClient()



async function event_CREATE(newEvent, idUser) {
    if (!idUser) {
        return {
            statusCode: 400,
            error: "Id do usuário não fornecido para a criação do novo evento"
        }
    }

    const eventData = {
        user: { connect: { id: idUser } },
        title: newEvent.title,
        address: newEvent.address,
        description: newEvent.description,
        date: newEvent.date,
        notification: newEvent.notification,
        scheduleAt: newEvent.scheduleAt,
        expired: newEvent.expired,
        statusNotification: newEvent.statusNotification,
        categoriaId: newEvent.categoriaId,
    };

    for (const key in eventData) {
        if (eventData[key] == null || eventData[key] === "") {
            delete eventData[key]
        }
    }

    const categoriaId = eventData.categoriaId;
    delete eventData.categoriaId; 
    
    const categoryConnect = categoriaId ? {
        categoria: {
            connect: {
                id: categoriaId
            }
        }
    } : {};
    
    console.log("CATEGORIA", categoriaId)
    console.log("EVENTO", eventData)
    try {
        const eventCreated = await prisma.evento.create({
            data: {
                ...eventData,       
                ...categoryConnect, 
            }
        });
        
        return eventCreated;
        
    } catch (err) {
        console.error("Erro ao criar evento no Prisma:", err);
        if (err.clientVersion) {
             return {
                error: "Dados inválidos ou Categoria não encontrada.",
            }
        }
        
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
                error: "O evento não foi deletado"
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
 
async function event_UPDATE(dataUpdatedEvent) {
    const {
        userId,
        eventId,
        newTitle,
        newDate,
        newAddress,
        newDescription,
        newCategoriaId
    } = dataUpdatedEvent

    try {
        const newEventData = Object.fromEntries(
            Object.entries({
                title: newTitle,
                date: newDate,
                address: newAddress,
                description: newDescription,
                categoriaId: newCategoriaId
            }).filter(([_, value]) => value != null && value !== "")
        )
        const eventUpdated = await prisma.evento.update({
             where: {
                userId: userId,
                id: eventId
             },
             data: newEventData
        })
        return eventUpdated
    } catch (err) {
         if (err.code === 'P2025') {
            return {
                error: "O evento que voce tentou alterar não existe.",
                statusCode: 404
            }
         }
         console.error(err)
         return {
            error: "Não foi possível alterar o evento."
         }
    }
}


async function event_NOTIFICATION(
    idUser, eventId, scheduleAt, bodyMessage, titleMessage
) {
    try {
        const tokens = await prisma.deviceToken.findMany({
            where: { userId: idUser },
            select: { token: true }
        })

        if (!tokens.length) {
            return { 
                statusCode: 404,
                error: "Usuário não possui nenhum push token registrado." 
            }
        }
        const expoTokens = tokens
            .map(token => token.token)
            .filter(token => Expo.isExpoPushToken(token));

        if (!expoTokens.length) {
            return { 
                statusCode: 404,
                error: "Nenhum push token válido encontrado." 
            }
        }

        const response = await sendToQueue(
            { idUser, eventId, scheduleAt, bodyMessage, titleMessage }
        )
        if (response?.MessageId) return true
        return { error: "Notificação de evento não agendada." }
    } catch (err) {
        console.log("Erro ao enviar para SQS:", err);
        return {
            error: "Não foi possível agendar notificação."
        }
    }
}


export default {
    event_CREATE,
    event_DELETE,
    event_UPDATE,
    event_LIST,
    event_NOTIFICATION
}