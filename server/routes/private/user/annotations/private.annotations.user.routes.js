import PrivateAnnotationsUserControllers from "../../../../controllers/private/user/annotations/private.annotations.user.controllers.js"
import { Router } from "express";
const router = Router()

router.post('/annotation/create', PrivateAnnotationsUserControllers.create_annotation_Controller_POST)
router.get('/annotation/list', PrivateAnnotationsUserControllers.list_annotation_Controller_GET)
router.delete('/annotation/delete/:id', PrivateAnnotationsUserControllers.delete_annotation_Controller_DELETE)
router.put('/annotation/update/:id', PrivateAnnotationsUserControllers.update_annotation_Controller_UPDATE)

export default router 