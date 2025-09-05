import AuthControllers from '../../controllers/auth/auth.controller.js'
import ResetPasswordControllers from '../../controllers/auth/reset_password.controller.js'
import Route from 'express'
const route = Route()

route.post('/auth/cadastro', AuthControllers.createUserController)
route.post('/auth/login', AuthControllers.loginUserController)
route.post('/auth/refresh-token', AuthControllers.refreshTokenController)
route.post('/auth/logout', AuthControllers.logoutController)
route.post('/auth/reset-password', ResetPasswordControllers.resetPassword_Controller)
route.post('/auth/reset-password-send', ResetPasswordControllers.sendEmailResetPassword_Controller)

export default route