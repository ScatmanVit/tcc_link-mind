import PrivateAdminController from '../../../controllers/private/admin/private.admin.controller.js'
// import PrivateUserController from '../../controllers/private/user/private.user.controller.js'
import Route from 'express'
const route = Route()

// rotas privadas aqui
route.get('/list-users/', PrivateAdminController.list_Admin_Controller_LIST)
route.delete('/delete/:id', PrivateAdminController.delete_Admin_Controller_DELETE)
// route.delete('/user/update/:id' Controller de UPDATE)


export default route