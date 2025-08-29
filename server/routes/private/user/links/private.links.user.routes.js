import PrivateLinksUserController from '../../../../controllers/private/user/links/private.links.user.controller.js'
// import PrivateAdminController from '../../controllers/private/admin/private.user.controller.js'
import auth from '../../../../middlewares/user/middlewares.user.js'
import Route from 'express'
const route = Route()

route.get('/links/list', auth, PrivateLinksUserController.links_list_Controller_GET)
route.post('/link/create', auth, PrivateLinksUserController.links_create_Controller_POST)
route.delete('/link/delete:id', auth, PrivateLinksUserController.links_delete_Controller_DELETE)

export default route

