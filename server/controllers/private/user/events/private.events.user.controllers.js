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
    } catch(err) {
        console.error("Ocorreu um erro no servidor [ CREATE EVENT ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })
    }
}

async function event_list_Controller_GET(req, res) {
    
}

async function event_delete_Controller_DELETE(req, res) {
    
}

async function event_update_Controller_PUT(req, res) {
    
}



export default {
    event_create_Controller_POST,
    event_delete_Controller_DELETE,
    event_update_Controller_PUT,
    event_list_Controller_GET
}