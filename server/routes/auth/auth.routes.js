import AuthControllers from '../../controllers/auth/auth.controller.js'
import Route from 'express'
const route = Route()

route.post('/auth/cadastro', AuthControllers.createUserController)
route.post('/auth/login', AuthControllers.loginUserController)
route.post('/auth/refresh-token', AuthControllers.refreshTokenController)
route.post('/auth/logout', AuthControllers.logoutController)

export default route