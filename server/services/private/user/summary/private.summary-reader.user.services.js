import redis from '../../../../config/redis.js'
import { PrismaClient } from "@prisma/client";
import axios from 'axios'
import dotenv from 'dotenv'
import { summary_Text_AI } from './summary-text-IA.js';
import { uploadFile } from '../../../supabase/storage.services.js'; 
dotenv.config()

const prisma = new PrismaClient()
const JINAAI_API_KEY = process.env.JINAAI_API_KEY
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET

async function summary_CREATE(
    instructionsFromUser, 
    userId, 
    resource, 
    resourceType, 
    resourceId, 
    categoriaId,
    nameUser 
) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const redisKey = `summary:${userId}:${today}`
        const currentCount = await redis.get(redisKey);
        
        if (currentCount && parseInt(currentCount) >= 2) {
            return { 
                error: 'Limite diário atingido' ,
                statusCode: 429
            }
        }
        
        const linkResource = await prisma.link.findFirst({
            where: {
                id: resourceId,
                userId: userId
            }
        })
        if (!linkResource) {
            return {
                error: "Não possível encontrar link com essa url e ID",
                statusCode: 404
            }
        }
        if (linkResource.summary_link) {
            return {
                error: "Esse link já foi resumido",
                statusCode: 429
            }
        }
        
        let summary_text = ""
        
        if (resourceType === "web") {
            const scrappingPageResponse = await axios.get(`https://r.jina.ai/${resource}`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${JINAAI_API_KEY}`,
                    "X-Return-Format": "text",
                    "X-Retain-Images": "none",
                    "X-Remove-Selector": "header, footer, nav, aside, .sidebar, .menu, .ad-banner, .cookie-consent"               
                }
            })
            const rawText = scrappingPageResponse.data.data.text || "";
            const cleanedText = rawText
                .replace(/\s+/g, ' ') 
                .trim();
            
            if (!cleanedText.trim()) {
                 throw new Error("Jina AI não retornou conteúdo válido para resumo.");
            }
            
            const summaryResult = await summary_Text_AI(
                cleanedText,
                nameUser,
                instructionsFromUser,
            )
            
            if (summaryResult?.error) {
                throw new Error(summaryResult.error || "Ocorreu um erro ao tentar resumir o seu recurso com IA (Groq).");
            }
            summary_text = summaryResult.summaryResourceText;
        } // else resourceType === "youtube ai vai pra api do youtube"

        if (!summary_text) {
             throw new Error("O resumo final está vazio.");
        }
        
        const storagePath = `${SUPABASE_STORAGE_BUCKET}/${userId}/${resourceId}.txt`;
        const summaryBuffer = Buffer.from(summary_text, 'utf-8');
        
        await uploadFile(storagePath, summaryBuffer, {
            contentType: 'text/plain',
            upsert: true
        });


        await prisma.link.update({
            where: { 
                id: resourceId 
            },
            data: { 
                summary_link: true 
            }
        });

        const newCount = await redis.incr(redisKey)
        if (newCount === 1) {
            await redis.expire(redisKey, 86400);
        }

        return {
            summary: summary_text
        }

    } catch(err) {
        console.error("Erro no processo de resumo:", err);
        
        return {
            error: err.message || "Não foi possível resumir o link.",
            statusCode: err.statusCode || 500
        }
    }
}

export default { 
    summary_CREATE 
}