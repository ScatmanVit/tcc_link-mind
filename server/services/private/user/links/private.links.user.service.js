import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function links_CREATE(dataNewLink){
    const {    
        title, 
        link, 
        description, 
        categoriaId, 
        estadoId,
        idUser,
        notification,
        tagsRelacionadas
    } = dataNewLink

    if(!idUser) return { 
        error: "Id do usuário não fornecido para a criação do novo link" 
    }
    try {
        const newLink = await prisma.link.create({
            data: {
                name: title,
                link: link,
                description: description ? description : null,
                categoriaId: categoriaId ? categoriaId : null,
                estadoId: estadoId ? estadoId : null,
                tagsRelacionadas: tagsRelacionadas ? tagsRelacionadas : null,
                notification: notification ? notification : null
            }
        })
        return newLink
    } catch(err){
        console.error(err)
        return {
            error: "Não foi possível criar o novo link"
        }
    }
}

async function links_LIST(idUser){
    if(!idUser) {
        return { 
            error: "Id do usuário não fornecido para busca dos links do usuário" 
        }
    }

    try {
        const links = await prisma.link.findMany({
            where: {
                userId: idUser
            }
        })
        if(links.lenth === 0) {
            return { 
                error: "Sem links disponíveis para esse id de usuário" 
            }
        } 
        return links
    } catch(err) {
        console.error(err) 
        return { 
            error: "Não foi possível buscar links do usuário" 
        }
    }
}
export default {
    links_LIST,
    links_CREATE
}