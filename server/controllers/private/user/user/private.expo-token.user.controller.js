import PrivateUserDeviceTokenServices from '../../../../services/private/user/user/private.expo-token.user.service.js'
import { findOneUser } from '../../../../utils/utils.js'

async function register_EXPO_TOKEN_POST(req, res) {
    const userId = req.user?.id
    const { EXPO_DEVICE_TOKEN } = req.body

    if (!userId) {
        return res.status(400).json({
            error: "Usuário não autenticado. Não é possível registar TOKEN."
        })
    }
    if (!EXPO_DEVICE_TOKEN) {
        return res.status(400).json({
            error: "Não foi fornecido TOKEN para registro."
        })
    }
    try {
        const userExist = await findOneUser("", userId)
		if (!userExist) {
			return res.status(404).json({
				error: "Usuário não encontrado. Não é possível registrar TOKEN."
			})
		} 

        const tokenRegistered = await PrivateUserDeviceTokenServices
                    .register_EXPO_TOKEN(userId, EXPO_DEVICE_TOKEN)
        if (tokenRegistered?.error) {
            return res.status(tokenRegistered.statusCode || 500).json({
                error: tokenRegistered.error
            })
        } 
        if (tokenRegistered) {
            return res.status(201).json({
                success: true,
                message: "Token registrado com sucesso."
            })
        }
    } catch (err) {
        console.error("Ocorreu um erro no servidor [ REGISTER TOKEN ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })
    }
}


export default {
    register_EXPO_TOKEN_POST
}