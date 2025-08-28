import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const jwt_secret = process.env.JWT_SECRET

function auth(req, res, next){
    try {
        const token = req.headers.authorization // isso se for mobile, separar lógica depois, pra padronizar a chegada do id no controller
        if (!token) {
            return res.status(401).json({
                error: "Acesso negado"
            })
        }
        const token_formated = token.replace("Bearer ", "")
        const decoded = jwt.verify(token_formated, jwt_secret)

        req.user = decoded
        next()
    } catch(err){
        res.status(401).json({
            error: "Token Inválido"
        })
        console.error(err)
    }
}

export default auth