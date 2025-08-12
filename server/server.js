import app from './config/app.js'
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT
const client_id = process.env.CLIENT_GOOGLE_ID

console.log(client_id && "id client_id o google fornecido")
app.listen(port, () => console.log("Servidor rodando.."))