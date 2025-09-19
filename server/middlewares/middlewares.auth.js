import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
 
const jwt_secret = process.env.JWT_SECRET

function auth(req, res, next) {
	try {
		let token
		if (req.cookies?.token) {
			token = req.cookies.token
		} else {
			token = req.headers.authorization
		}
		if (!token) {
			return res.status(401).json({
				error: "Acesso negado"
			})
		}
		const token_formated = token.replace("Bearer ", "")
		const decoded = jwt.verify(token_formated, jwt_secret)

		req.user = decoded
		next()
	} catch (err) {
		res.status(401).json({
			error: "Token Inválido"
		})
		console.error(err)
	}
}

export default auth