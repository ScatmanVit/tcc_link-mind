import AuthRoutes from '../routes/auth/auth.routes.js'
import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'// para ambiente de desenvolvimeto, será configurado futuramente

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json()) 

app.use('/linkmind', AuthRoutes)

export default app