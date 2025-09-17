import PrivateLinksUserController from '../../../../controllers/private/user/links/private.links.user.controller.js'
import Route from 'express'
const route = Route()

route.get('/links/list', PrivateLinksUserController.links_list_Controller_GET)
route.post('/link/create', PrivateLinksUserController.links_create_Controller_POST)
route.delete('/link/delete/:id', PrivateLinksUserController.links_delete_Controller_DELETE)
route.put('/link/update/:id', PrivateLinksUserController.links_update_Controller_UPDATE)

export default route

