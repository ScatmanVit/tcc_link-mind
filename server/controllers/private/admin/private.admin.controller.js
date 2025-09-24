import PrivateAdminService from '../../../services/private/admin/private.actions.admin.service.js'
import { findOneUser, captalize, formatEmail } from '../../../utils/utils.js'
import bcrypt from 'bcrypt'

async function create_Admin_Controller_CREATE(req, res) {
    const { name, email, password, role, status } = req.body
    if (!name || !email || !password || !role || status === undefined) {
        return res.status(400).json({
            error: "Informações necessárias para cadastro não fornecidas"
        })
    }
    try {
        let hashPassword;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashPassword = await bcrypt.hash(password, salt);
        }
        const userCreated = await PrivateAdminService
                .create_Admin_service_CREATE({
                    name: name,
                    email: formatEmail(email),
                    password: hashPassword,
                    role: role,
                    status: status
                })
        if (userCreated?.error) {
            return res.status(userCreated.statusCode || 500).json({
                error: userCreated.error
            })
        } else {
            return res.status(201).json({
                success: true,
                message: `Usuário ${captalize(name)} criado com sucesso!` ,
                user: {
                    id: userCreated.id,
                    name: userCreated.name,
                    email: userCreated.email,
                    role: userCreated.role,
                    status: userCreated.status
                }
            })
        }
    } catch (err) {
        console.error("Ocorreu um erro no servidor [ CREATE USER ADM ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor"
        })
    }
}

async function list_Admin_Controller_LIST(req, res) {
    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    if (limit > 25) {
        limit = 25
    }
    try {
        const users = await PrivateAdminService
                .list_Admin_Service_LIST(page, limit)
        if (users?.error) {
            return res.status(users.statusCode || 500).json({
                error: users.error
            })
        } else {
            let usersSafe
            return res.status(200).json({
                success: true,
                message: users.length == 0 
                                ? `Não há ${limit} ou ao menos 1 usuário cadastrado.`
                                : "Usuários listados com sucesso!",
                users: users.length == 0 
                            ? [] 
                            : usersSafe = users.map(
                                ({ password, ...rest }) => rest
                            )               
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
            return res.status(userDeleted.statusCode || 500).json({
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


async function update_Admin_Controller_UPDATE(req, res) {
    const idUser = req.params.id
    if (!idUser) {
        return res.status(400).json({
            error: "Id do usuário não fornecido"
        })
    }
    const {
        newName,
        newEmail,
        newPassword,
        newRole,
        newStatus
    } = req.body
    try {
        let hashedPassword
        if (newPassword) {
            const salt = await bcrypt.genSalt(10)
            hashedPassword = await bcrypt.hash(newPassword, salt)     
        }
        const userExist = await findOneUser("", idUser)
        if (!userExist) {
            return res.status(404).json({
                error: "Não existe usuário com esse Id"
            })
        }
        const userUpdated = await PrivateAdminService.
            update_Admin_service_UPDATE({
                id: idUser,
                name: newName,
                email: newEmail,
                password: hashedPassword,
                role: newRole,
                status: newStatus
            })
        if (userUpdated?.error) {
            return res.status(userUpdated.statusCode || 500).json({
                error: userUpdated.error
            })
        } else {
            return res.status(200).json({
                success: true,
                message: `Usuário ${captalize(userExist.name)} alterado com sucesso com seus novos dados!`,
                user: userUpdated
            })
        }
    } catch (err) {
        console.error("Ocorreu um erro no servidor [ UPDATE USER ADM ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor"
        })
    }
}


async function sendEmaill_Admin_Controller(req, res) {
    const { email, message, subject } = req.body
    if (!subject) {
        return res.status(400).json({
            error: "Subject não fornecido ou inválido"
        })
    }
    if (!email || !email.includes("@")) {
        return res.status(400).json({
            error: "Email não fornecido ou não válido"
        })
    }
    if (!message || message.trim().length === 0 ) {
        return res.status(400).json({
            error: "Mensagem não fornecida ou não válida."
        })
    }
    try {
        const userExist = await findOneUser(email, "")
        if (!userExist) {
            return res.status(404).json({
                error: "Não existe usuário com esse Id"
            })
        }
        const emailSend = await PrivateAdminService
            . sendEmail_Admin_Service({ email, message, subject })
        if (emailSend.error) {
            return res.status(emailSend.statusCode || 500).json({
                error: emailSend.error
            })
        } else {
            return res.status(200).json({
                success: true,
                message: `Mensagem enviada com sucesso para  ${email}`
            })
        }
        
    } catch (err) {
        console.error("Ocorreu um erro no servidor [ SEND EMAIL ADMIN ]", err.stack || err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor"
        })
    }
}


export default {
    create_Admin_Controller_CREATE,
    update_Admin_Controller_UPDATE,
    delete_Admin_Controller_DELETE,
    list_Admin_Controller_LIST,
    sendEmaill_Admin_Controller
}
