import PrivateAdminService from '../../../services/private/admin/private.actions.admin.service.js'
import { findOneUser, captalize, formatEmail } from '../../../utils/utils.js'


async function list_Admin_Controller_LIST(req, res) {
    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    if (limit > 30) {
        limit = 30
    }
    try {
        const users = await PrivateAdminService
                .list_Admin_Service_LIST(page, limit)
        if (users?.error) {
            return res.status(users.statusCode || 500).json({
                error: users.error
            })
        } else {
            return res.status(200).json({
                success: true,
                message: users < 10 
                                ? "Não há usuários cadastrados o suficiente para listagem."
                                : "Usuários listados com sucesso!",
                users: users < 10 
                            ? "Não há 10 ou mais de 10 usuários cadastrados." 
                            : JSON.parse(JSON.stringify(users))
            })
        }
    } catch (err) {
        console.error("Ocorreu um erro no servidor [ LIST USERS ADM ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })        
    }
}


async function delete_Admin_Controller_DELETE(req, res) {
    const idUser = req.params.id
    if (!idUser) {
        return res.status(400).json({
            error: "Id do usuário não fornecido."
        })
    }
    try {
        const userExist = await findOneUser("", idUser)
        if (!userExist) {
            return res.status(401).json({
                error: "Não existe usuário com esse Id."
            })
        }
        const userDeleted = await PrivateAdminService
                .delete_Admin_Service_DELETE(idUser)
        if (userDeleted?.error) {
            return res.status(linkUpdated.statusCode || 500).json({
                error: userDeleted.error
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "Usuário deletado com sucesso!"
            })
        }
    } catch (err) {
        console.error("Ocorreu um erro no servidor [ DELETE USER ADM ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })
    }
}

export default {
    delete_Admin_Controller_DELETE,
    list_Admin_Controller_LIST
}