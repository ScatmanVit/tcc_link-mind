import PrivateEventsUserControllers from "../../../../controllers/private/user/events/private.events.user.controllers.js";
import { Router } from "express";
const router = Router()

router.post('/event/create', PrivateEventsUserControllers.event_create_Controller_POST)

export default router