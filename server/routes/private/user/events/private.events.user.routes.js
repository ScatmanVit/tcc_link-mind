import PrivateEventsUserControllers from "../../../../controllers/private/user/events/private.events.user.controllers.js";
import { Router } from "express";
const router = Router()

router.get('/event/list', PrivateEventsUserControllers.event_list_Controller_GET)
router.post('/event/create', PrivateEventsUserControllers.event_create_Controller_POST)
router.delete('/event/delete/:id', PrivateEventsUserControllers.event_delete_Controller_DELETE)
router.post('/event/notification/:id', PrivateEventsUserControllers.event_Controller_NOTIFICATION)

export default router