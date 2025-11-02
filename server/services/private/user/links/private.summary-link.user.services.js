import redis from '../../../../config/redis.js'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function summary_link(userId, urlLink, idLink, nameUser) {
    try {

        try { 
            const today = new Date().toISOString().split('T')[0];
            const redisKey = `summary-link:${userId}:${today}`
            const currentCount = await redis.get(redisKey);
            
            if (currentCount && parseInt(currentCount) >= 2) {
                return { 
                    error: 'Limite diário atingido' ,
                    statusCode: 429
                }
            }
            
            const newCount = await redis.incr(redisKey)
            if (newCount === 1) {
                await redis.expire(redisKey, 86400);
            }

        } catch(err) {
            console.error("Ocorreu um erro ao verificar/salvar no redis", err)
            throw new Error("Erro no redis service", err)
        }

        const rateLimitLink = await prisma.link.findUnique({
            where: {
                id: idLink,
                link: urlLink,
                userId: userId
            }
        })

        if (!rateLimitLink) {
            return {
                error: "Não possível encontrar link com essa url e ID",
                statusCode: 404
            }
        }
        if (rateLimitLink.summary_count) {
            return {
                error: "Esse link já foi resumido",
                statusCode: 429
            }
        }

        /*
        Envia para aws: {linkId, linkUrl, nameUser} await ...
        e retorna para o controller { summaryId, summary } o resumo que retorna para o front-end
        
        */

        // Se tudo der certo, você retornaria os dados do resumo aqui
        // Ex: return { summary: "...", summaryId: "..." }

    } catch(err) {
        console.error(err)
         return {
            error: "Não foi possível resumir o link"
         }
    }
}

export default {
    summary_link
}