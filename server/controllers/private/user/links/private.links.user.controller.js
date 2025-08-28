import PrivateUserService from '../../../../services/private/user/links/private.links.user.service.js'
import { findOneUser } from '../../../../utils/utils.js'
import dotenv from 'dotenv'
dotenv.config()


async function links_create_Controller_POST(req, res) {
    try {
        const userId = req.user?.id
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
        const { title, link, description, categoriaId, estadoId, notification, tagsRelacionadas } = req.body

        if (!title || !link) {
            return res.status(400).json({
                error: "Campos obrigatórios não fornecidos: título e link."
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

 
async function links_list_Controller_GET(req, res){
    const userId = req.user?.id
    try {
        if(!userId) return res.status(401).json({
            error: "ID Token não fornecido no token."
        })
        const userExist = await findOneUser("", userId)
        if(!userExist) {
            return res.status(401).json({
                error: "Não existe usuário com esse ID para listar os Links."
            })
        }
        const linksUser = await PrivateUserService.links_LIST(userId)
        if(linksUser?.error) {
            return res.status(400).json({
                 error: linksUser.error 
            })
        } 
        
        return res.status(200).json({ 
            message: "Links do usuário obtidos com sucesso!", linksUser
        })
    } catch(err) {
        console.error("Erro no servidor, [ LISTAGEM LINKS ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })
    }
}

export default {
    links_create_Controller_POST,
    links_list_Controller_GET
}