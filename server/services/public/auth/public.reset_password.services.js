import { PrismaClient } from "@prisma/client";
import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

const api_key_resed = process.env.RESEND_KEY_API

const prisma = new PrismaClient()
const resend = new Resend(api_key_resed);

async function sendEmailResetPassword_Service(data) {
    const { email, urlResetPassword } = data
    if (!email || !urlResetPassword) {
        return { 
            error: "Informações não fornecidas para envio do email para recuperação de senha." 
        }
    }
    try {
        const res = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Redefinição de senha | Link Mind",
            html: `
            <div style="font-family: 'Poppins', sans-serif; font-size: 15px; color: #333; background-color: #f4f4f4; padding: 24px">
                <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.05)">
                    <div style="background-color: #09090B; text-align: center; padding: 20px">
                        <a href="[Website Link]" target="_blank" style="text-decoration: none; height: 50px">
                            <img src="https://i.postimg.cc/GTbmJTj0/icon.png" alt="logo" style="height: 100px" />
                        </a>
                    </div>
                        <div style="padding: 30px">
                            <h2 style="font-size: 24px; margin-bottom: 20px; color: #000">Solicitação de Redefinição de Senha</h2>
                            <p style="margin-bottom: 16px">
                                Recebemos uma solicitação para redefinir a senha da sua conta. Para continuar, clique no botão abaixo:
                            </p>
                            <p style="text-align: center; margin: 30px 0">
                                <a href="${urlResetPassword}" style="background-color: #00BCD4; color: #fff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold">Redefinir Senha</a>
                            </p>
                            <p style="margin-bottom: 16px">Este link <b>expira em 15 minutos.</b></p>
                            <p style="margin-bottom: 16px">
                                Se você não solicitou essa alteração, ignore este e-mail ou entre em contato conosco. Sua conta permanece segura.
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
        if (res?.error) {
            return {
                error: res.error 
            }
        }
        console.log("Email enviado com sucesso")
        return { 
            success: true 
        }   
    } catch(err) {
        console.error(err)
        return {
            error: "Ocorreu um erro ao enviar o email"
        }
    }
}

async function resetPassword_Service() {
  return { 
            success: true 
        }
}

export default {
    sendEmailResetPassword_Service,
    resetPassword_Service
}