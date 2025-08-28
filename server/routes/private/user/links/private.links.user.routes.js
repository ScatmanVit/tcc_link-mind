import PrivateUserController from '../../../../controllers/private/user/links/private.links.user.controller.js'
// import PrivateAdminController from '../../controllers/private/admin/private.user.controller.js'
import auth from '../../../../middlewares/user/middlewares.user.js'
import Route from 'express'
const route = Route()

route.get("/links", auth, PrivateUserController.links_list_Controller_GET)

export default route

