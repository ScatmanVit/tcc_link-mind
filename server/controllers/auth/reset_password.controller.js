import UserServiceResetPassword from '../../services/public/auth/public.reset_password.services.js'
import { captalize, findOneUser, formatEmail } from "../../utils/utils.js"
import jwt from 'jsonwebtoken'
 
const jwt_secret = process.env.JWT_SECRET

async function sendEmailResetPassword_Controller(req, res) {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({
            error: "Por favor forneça o email de recuperação de senha"
        })
    }
    try {
        console.log("ok")
        const userExist = await findOneUser(formatEmail(email), "")
        if(!userExist) {
            return res.status(404).json({
                error: "Não existe usuário cadastrado com esse email."
            })
        }
        const tokenResetPassword = jwt.sign(
			{ id: userExist.id, email: userExist.email },
			jwt_secret,
			{ expiresIn: "15m" }   
		);
        const urlResetPassword = `https://tcc-link-mind-ncqzwm8h9-vitors-projects-16a44ae6.vercel.app/reset-password?token=${tokenResetPassword}`
        const resSendEmail = await UserServiceResetPassword
            .sendEmailResetPassword_Service({ 
                email, 
                urlResetPassword 
            })
        if (resSendEmail?.error) {
            return res.status(400).json({
                errorExplain: "Ocorreu um erro no servidor",
                error: resSendEmail.error
            })
        }
        console.log(resSendEmail.error)
        return res.status(200).json({
            success: true,
            message: `O seu email de recuperação já foi enviado ${captalize(userExist.name)}!`
        })
    } catch(err) {
        console.error("Ocorreu um erro no servidor [ RECOVER PASSWORD ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })
    }
}

async function resetPassword_Controller(req, res) {

}

export default {
    sendEmailResetPassword_Controller,
    resetPassword_Controller
}