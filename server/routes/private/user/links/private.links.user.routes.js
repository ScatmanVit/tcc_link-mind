import PrivateUserController from '../../../../controllers/private/user/links/private.links.user.controller.js'
// import PrivateAdminController from '../../controllers/private/admin/private.user.controller.js'
import auth from '../../../../middlewares/user/middlewares.user.js'
import Route from 'express'
const route = Route()

route.post('/links/create', auth, PrivateUserController.links_create_Controller_POST)
route.get('/links/list', auth, PrivateUserController.links_list_Controller_GET)

export default route

