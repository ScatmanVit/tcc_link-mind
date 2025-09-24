import { PrismaClient } from "@prisma/client";
import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

const api_key_resed = process.env.RESEND_KEY_API

const prisma = new PrismaClient()
const resend = new Resend(api_key_resed);

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

async function sendEmail_Admin_Service(data) {
    const { email, message, subject } = data
    if (!email || !message || !subject) {
        return {
            error: "Email, mensagem ou subject a ser enviados não fornecidos."
        }
    }
    try {
        const emailSend = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: `${subject} | Link Mind`,
            html: `
                <div style="font-family: 'Poppins', sans-serif; font-size: 15px; color: #333; background-color: #f4f4f4; padding: 24px">
                    <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.05)">
                        <div style="background-color: #09090B; text-align: center; padding: 20px">
                            <a href="[Website Link]" target="_blank" style="text-decoration: none; height: 50px">
                                <img src="https://i.postimg.cc/GTbmJTj0/icon.png" alt="logo" style="height: 100px" />
                            </a>
                        </div>
                        <div style="padding: 30px">
                            <h2 style="font-size: 24px; margin-bottom: 20px; color: #000">Comunicado Importante</h2>
                            <p style="margin-bottom: 16px">
                                Olá,
                            </p>
                            <p style="margin-bottom: 10px">
                                ${message}
                            </p>
                            <p style="margin-bottom: 14px">
                                Caso tenha dúvidas ou precise de suporte, entre em contato conosco.  
                            </p>
                            <p>Atenciosamente,<br /><b>Link Mind</b></p>
                        </div>
                        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 13px; color: #777">
                            Este e-mail foi enviado para ${email}<br />
                            Você está recebendo esta mensagem porque está registrado em Link Mind.
                        </div>
                    </div>
                </div>
                 `
        });
        if (emailSend?.error) {
            return {
                success: false,
                error: emailSend.error,
                statusCode: 500
            };
        }

        if (emailSend?.id) {
            console.log(emailSend.id)
            return {
                success: false,
                error: "Falha desconhecida ao enviar e-mail.",
                statusCode: 500
            };
        }
        console.log("Email enviado com sucesso:", emailSend.id);
        return  true
    } catch (err) {
        console.log(err.stack || err)
        return {
            error: "Não foi possível enviar o email",
            statusCode: 500
        }
    }
}

export default {
    create_Admin_service_CREATE,
    delete_Admin_Service_DELETE,
    update_Admin_service_UPDATE,
    sendEmail_Admin_Service,
    list_Admin_Service_LIST
} 