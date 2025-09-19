import UserLinkPrivateRoutes from '../routes/private/user/links/private.links.user.routes.js'
import AdminPrivateRoutes from '../routes/private/admin/private.admin.routes.js'
import isAdmin from '../middlewares/middlewares.admin.js'
import auth from '../middlewares/middlewares.auth.js'
import AuthRoutes from '../routes/auth/auth.routes.js'
import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'// para ambiente de desenvolvimeto, será configurado futuramente

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json()) 

app.use('/api/v1/linkmind', AuthRoutes)
app.use('/api/v1/linkmind', UserLinkPrivateRoutes) 
app.use('/api/v1/linkmind/admin', auth, isAdmin, AdminPrivateRoutes)
app.post('/api/v1/linkmind/check-admin', auth, isAdmin, (req, res) => {
    res.status(200).json({
        seccess: true,
        message: "Usuário é admin"
    })
} )

export default app