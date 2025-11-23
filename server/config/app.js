import UserCategoryPrivateRoutes from '../routes/private/user/categories/private.categories.user.routes.js'
import UserEventPrivateRoutes from '../routes/private/user/events/private.events.user.routes.js'
import UserLinkPrivateRoutes from '../routes/private/user/links/private.links.user.routes.js'
import AdminPrivateRoutes from '../routes/private/admin/private.admin.routes.js'
import isAdmin from '../middlewares/middlewares.admin.js'
import auth from '../middlewares/middlewares.auth.js'
import AuthRoutes from '../routes/auth/auth.routes.js'
import cookieParser from 'cookie-parser';
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'// para ambiente de desenvolvimeto, será configurado futuramente

const app = express()

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:8081'],
  credentials: true
};

app.use(cors(corsOptions))
app.use(helmet())
app.use(cookieParser())
app.use(express.json()) 

app.use('/api/v1/linkmind', AuthRoutes)
app.use('/api/v1/linkmind', auth, UserEventPrivateRoutes)
app.use('/api/v1/linkmind', auth, UserLinkPrivateRoutes)
app.use('/api/v1/linkmind', auth, UserCategoryPrivateRoutes)
app.use('/api/v1/linkmind/admin', auth, isAdmin, AdminPrivateRoutes)
app.post('/api/v1/linkmind/check-admin', auth, isAdmin, (req, res) => {
    res.status(200).json({
        seccess: true,
        message: "Usuário é admin"
    })
})

export default app
