 import { PrismaClient } from "@prisma/client";
 const prisma = new PrismaClient()

 async function annotation_CREATE(data, userId) {
    try {
        for (const key in data) {
            if (data[key] == null || data[key] === "") {
                delete data[key]
            }
        }
        const categoriaId = data.categoriaId
        delete data.categoriaId
 
        const categoryConnect = categoriaId ? {
            categoria: {
                connect: {
                    id: categoriaId
                }
            }
        } : {};

        const annotationCreated = await prisma.anotacao.create({
            data: {
                user: { connect: { id: userId } },
                ...data,
                ...categoryConnect
            }
        })
        return annotationCreated
    } catch (err) {
        console.error(err)
        return {
            error: "Não foi possível criar anotação."
        }
    }
 }

async function annotation_LIST(userId) {
    try {
        const annotationsList = await prisma.anotacao.findMany({
            where: {
                userId
            }
        })
        return annotationsList
    } catch (err) {
        console.error(err)
        return {
            error: 'Não foi possível listar anotações.'
        }
    }
}

async function annotation_DELETE(userId, annotationId) {
    try {
        const annotationDeleted = await prisma.anotacao.deleteMany({
            where: {
                id: annotationId,
                userId
            }
        })
        if (annotationDeleted.count === 0) {
            return {
                error: "A anotação não foi deletada"
            }
        }
        return annotationDeleted.count > 0
    } catch (err) {
        if (err.code === 'P2025') {
            return {
                error: "A anotação que você tentou deletar não existe",
                statusCode: 404
            }
        }
        console.error(err)
        return {
            error: "Não foi possível deletar a anotação"
        }
    }
}


 export default {
    annotation_CREATE,
    annotation_DELETE,    
    annotation_LIST
}