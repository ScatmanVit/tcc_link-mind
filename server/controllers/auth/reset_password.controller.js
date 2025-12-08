import UserServiceResetPassword from '../../services/auth/auth.reset_password.services.js'
import { captalize, findOneUser, formatEmail } from "../../utils/utils.js"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const jwt_secret = process.env.JWT_SECRET
const FRONT_URL = process.env.FRONT_END_URL

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
		if (!userExist) {
			return res.status(404).json({
				error: "Não existe usuário cadastrado com esse email."
			})
		}
		const tokenResetPassword = jwt.sign(
			{ id: userExist.id, email: userExist.email },
			jwt_secret,
			{ expiresIn: "15m" }
		);
		const urlResetPassword = `${FRONT_URL}/reset-password?token=${tokenResetPassword}`
		const resSendEmail = await UserServiceResetPassword
			.sendEmailResetPassword_Service({
				email,
				urlResetPassword
			})
		if (resSendEmail?.error) {
			return res.status(resSendEmail.statusCode || 500).json({
				errorExplain: "Ocorreu um erro no servidor",
				error: resSendEmail.error
			})
		}
		return res.status(200).json({
			success: true,
			message: `O seu email de recuperação já foi enviado ${captalize(userExist.name)}!`
		})
	} catch (err) {
		console.error("Ocorreu um erro no servidor [ RECOVER PASSWORD ]", err)
		return res.status(500).json({
			error: "Ocorreu um erro no servidor."
		})
	}
}

async function resetPassword_Controller(req, res) {
	const { token, newPassword } = req.body
	if (!token || !newPassword) {
		return res.status(400).json({
			error: "Nova senha ou token não recebidos."
		})
	}
	try {
		let decoded
		try {
			decoded = jwt.verify(token, jwt_secret);
		} catch (err) {
			return res.status(401).json({
				error: "Token inválido ou expirado"
			});
		}
		const resResetPassword = await UserServiceResetPassword
			.resetPassword_Service(formatEmail(decoded.email), newPassword)
		if (resResetPassword?.error) {
			return res.status(resResetPassword.statusCode || 500).json({
				error: resResetPassword.error
			})
		}
		return res.status(200).json({
			success: true,
			message: "Sua senha foi redefinida! Já pode efetuar o login novamente!"
		})
	} catch (err) {
		console.error("Ocorreu um erro no servidor, [ RESET PASSWORD ]", err)
		return res.status(500).json({
			error: "Ocorreu um erro no servidor."
		})
	}
}

export default {
	sendEmailResetPassword_Controller,
	resetPassword_Controller
}