import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

async function register_EXPO_TOKEN(idUser, TOKEN){
    try {
        const tokenRegistered = await prisma.deviceToken.upsert({
            where: { token: TOKEN },
            update: {},
            create: {
                userId: idUser,
                token: TOKEN
            }
        })
        if (!tokenRegistered) {
            return {
                error: "O token não foi registrado."
            }
        }
        return true
    } catch (err) {
        console.error(err)
        return {
            error: "Não foi possível register token."
        }
    }
}

export default {
    register_EXPO_TOKEN
}