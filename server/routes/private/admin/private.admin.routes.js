import PrivateAdminController from '../../../controllers/private/admin/private.admin.controller.js'
import Route from 'express'
const route = Route()

route.post('/create-user', PrivateAdminController.create_Admin_Controller_CREATE)
route.get('/list-users/', PrivateAdminController.list_Admin_Controller_LIST)
route.delete('/delete-user/:id', PrivateAdminController.delete_Admin_Controller_DELETE)
route.put('/update-user/:id', PrivateAdminController.update_Admin_Controller_UPDATE)
route.post('/send-email-comunicate', PrivateAdminController.sendEmaill_Admin_Controller)

export default route