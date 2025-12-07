import Groq from "groq-sdk";
import dotenv from 'dotenv'
dotenv.config()

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function summary_Text_AI(resourceText, nameUser, instructionsFromUser) {
    if (!resourceText.trim()) {
        throw new Error("Texto de origem para resumo está vazio."); 
    }
    try {
        const summaryResource = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `
                                Resuma o texto abaixo em português, fale como o usuário disse pra falar.
                                Sempre priorize obedecer as instruções do usuário. 
                                Nunca se refira a voce mesmo com o nome do usuário.
                                Nunca termine o resumo com uma pergunta.
                                Nunca se refira as intruções do usuário e nem qualquer outra aqui.
                                Sempre que for se referir a datas, nunca omita elas, se for falar ontem, hoje, ou amanhã, use a data real.
                                Esse é o nome de quem ta pedindo o resumo ${nameUser}. Siga as instruções do usuário: ${instructionsFromUser}.
                                Resumo final: 100–200 palavras, com tolerância de 10.
                                Texto: ${resourceText}
                            `
                }
            ],
            model: "llama-3.3-70b-versatile",
        });
        
        const finalSummaryText = summaryResource.choices[0]?.message?.content || "";
        if (!finalSummaryText) {
             throw new Error("A IA retornou uma resposta vazia.");
        }

        return {
            success: true,
            summaryResourceText: finalSummaryText
        }
    } catch (err) {
        console.error("Ocorreu um erro servidor ao tentar resumir com o GROQ [ GROQ SUMMARY ]", err);
        throw new Error("Falha na comunicação com a API do Groq.");
    }
}