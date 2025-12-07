import PrivateSummaryUserController from '../../../../controllers/private/user/summary/private.summary.summary-reader.user.controllers.js'
import Route from 'express'
const router = Route()

router.post('/summary/link', PrivateSummaryUserController.summary_link_Controller)

export default router