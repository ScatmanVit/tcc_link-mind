import PrivateLinksUserController from '../../../../controllers/private/user/links/private.links.user.controllers.js'
import Route from 'express'
const route = Route()

route.get('/links/list', PrivateLinksUserController.links_list_Controller_GET)
route.post('/link/create', PrivateLinksUserController.links_create_Controller_POST)
route.post('/link/delete/:id', PrivateLinksUserController.links_delete_Controller_DELETE) // vou mudar o verbo http depois, só da para usar post ou get emulando o app na web
route.put('/link/update/:id', PrivateLinksUserController.links_update_Controller_UPDATE)

export default route

