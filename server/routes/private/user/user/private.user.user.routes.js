import PrivateUserDeviceTokenController from '../../../../controllers/private/user/user/private.expo-token.user.controller.js'
import Route from 'express'
const router = Route()

router.post('/user/device-token', PrivateUserDeviceTokenController.register_EXPO_TOKEN_POST)

export default router