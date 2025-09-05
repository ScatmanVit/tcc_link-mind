import { PrismaClient } from "@prisma/client";
import emailjs from '@emailjs/browser';
import dotenv from 'dotenv'
dotenv.config()

const public_key_emailjs = process.env.PUBLIC_KEY_EMAILJS
const service_id_emailjs = process.env.SERVICE_ID_EMAIJS
const template_id_emailjs = process.env.TEMPLATE_ID_EMAILJS

emailjs.init(public_key_emailjs)

const prisma = new PrismaClient()

async function sendEmailResetPassword_Service(data) {
    const { email, tokenResetPassword, urlResetPassword } = data
    if (!email || !tokenResetPassword || !urlResetPassword) {
        return { 
            error: "Informações não fornecidas para envio do email para recuperação de senha." 
        }
    }
    try {
        const res = emailjs.send(
            service_id_emailjs,
            template_id_emailjs,
            {
                user_email: email,
                reset_link: urlResetPassword
            },
            public_key_emailjs
        )
    } catch(err) {
        console.error(err)
        return {
            error: "Ocorreu um erro ao enviar o email"
        }
    }
}

async function resetPassword_Service() {

}