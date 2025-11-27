import PrivateUserServiceEvents from '../../../../services/private/user/events/private.events.user.services.js'
import { findOneUser } from '../../../../utils/utils.js'

async function event_create_Controller_POST(req, res) {
    const userId = req.user?.id
    const dataNewEvent = req.body

    if (!userId) {
        return res.status(401).json({
            error: "Id do usuário não recebido"
        })
    }
    if (!dataNewEvent.title) {
        return res.status(400).json({
            error: "Forneça um título para o seu novo evento."
        })
    }
    try {
        const userExist = await findOneUser("", userId)
        if (!userExist) {
            return res.status(404).json({
                error: "Usuário não encontrado. Não é possível criar evento."
            })
        }

        const eventCreated = await PrivateUserServiceEvents
            .event_CREATE(dataNewEvent, userId)

        if (eventCreated?.error) {
            return res.status(eventCreated.statusCode || 500).json({
                error: eventCreated.error
            })
        }
        return res.status(201).json({
            success: true,
            message: "Evento criado com sucesso!",
            eventCreated
        })
    } catch (err) {
        console.error("Ocorreu um erro no servidor [ CREATE EVENT ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })
    }
}

async function event_list_Controller_GET(req, res) {
    const userId = req.user?.id

    if (!userId) {
        return res.status(401).json({
            error: "Id do usuário não recebido"
        })
    }
    try {
        const eventsList = await PrivateUserServiceEvents
            .event_LIST(userId)

        if (eventsList?.error) {
            return res.status(eventsList.statusCode || 500).json({
                error: eventsList.error
            })
        }
        return res.status(200).json({
            success: true,
            message: "Eventos listados com sucesso.",
            events: eventsList
        })
    } catch (err) {
        console.error("Ocorreu um erro no servidor [ LIST EVENTS ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })
    }
}


async function event_delete_Controller_DELETE(req, res) {
    const userId = req.user?.id
    const eventId = req.params.id

    if (!userId) {
        return res.status(401).json({
            error: "Id do usuário não fornecido."
        })
    }

    if (!eventId) {
        return res.status(401).json({
            error: "Id do evento não fornecido."
        })
    }
    try {
        const eventDeleted = await PrivateUserServiceEvents
            .event_DELETE(userId, eventId)
        if (eventDeleted?.error) {
            return res.status(eventDeleted.statusCode || 500).json({
                error: eventDeleted.error
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "Evento deletado com sucesso."
            })
        }
    } catch (err) {
        console.error("Ocorreu um erro no servidor [ DELETE EVENT ], err")
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })
    }
}


async function event_Controller_NOTIFICATION(req, res) {
    const userId = req.user?.id
    const eventId = req.params.id
    const {
        scheduleAt,
        bodyMessage,
        titleMessage } = req.body

    if (!userId) {
        return res.status(401).json({
            error: "Id do usuário não fornecido."
        })
    }
    if (!scheduleAt) {
        return res.status(400).json({
            error: "Data de disparo da notificação não fornecida."
        })
    }
    if (!eventId || !bodyMessage || !titleMessage) {
        return res.status(400).json({
            error: "Informações necessárias para agendamento do evento não fornecidas."
        })
    }
    try {
        const userExist = await findOneUser("", userId)
        if (!userExist) {
            return res.status(404).json({
                error: "Usuário não encontrado. Não é possível criar evento."
            })
        }
        const resEventNotification = await PrivateUserServiceEvents
            .event_NOTIFICATION(userId, eventId, scheduleAt, bodyMessage, titleMessage)
        if (resEventNotification?.error) {
            return res.status(resEventNotification.statusCode || 500).json({
                error: resEventNotification.error
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "Evento agendado com sucesso!"
            })
        }
    } catch (err) {
        console.error("Ocorreu um erro no servidor [ EVENT NOTIFICATION ]")
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })
    }
}














































async function event_update_Controller_PUT(req, res) {

}



export default {
    event_create_Controller_POST,
    event_delete_Controller_DELETE,
    event_update_Controller_PUT,
    event_list_Controller_GET,
    event_Controller_NOTIFICATION
}