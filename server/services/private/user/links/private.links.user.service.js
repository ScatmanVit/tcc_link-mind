import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function links_CREATE(dataNewLink) {
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

  if (!idUser) {
    return { error: "Id do usuário não fornecido para a criação do novo link" }
  }

  try {
    const data = {
      title,
      link,
      userId: idUser,
      description: description || null,
      notification: notification || null,
    }

    if (categoriaId) data.categoriaId = categoriaId
    if (estadoId) data.estadoId = estadoId
    if (tagsRelacionadas && tagsRelacionadas.length) {
      data.tagRelacionadas = {
        connect: tagsRelacionadas.map(id => ({ id }))
      }
    }

    const newLink = await prisma.link.create({ data })
    return newLink
  } catch (err) {
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
    // ta quase lá, só falta o update e o delete
}