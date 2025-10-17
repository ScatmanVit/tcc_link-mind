import { PrismaClient } from "@prisma/client";
import { captalize } from "../../../../utils/utils.js";


const prisma = new PrismaClient()

async function category_CREATE(dataNewCategory, userId) {
    if (!userId) {
        return {
            error: "Id do usuário não fornecido para criação de categoria.",
            statusCode: 400
        }
    }
    try {
        const categoriesData = dataNewCategory.map(category => ({
            nome: captalize(String(category.name)),
            userId
        }))
        const categoryCreated = await prisma.categoria.createMany({
            data: categoriesData,
            skipDuplicates: true
        })
        return categoryCreated
    } catch(err) {
        console.log(err)
        return {
            error: "Não foi possível criar a categoria"
        }
    }
}

async function category_LIST(userId){
    if (!userId) {
        return {
            error: "Id do usuário não fornecido para listagem das categorias",
            statusCode: 400
        }
    }
    try {
        const categories = await prisma.categoria.findMany({
            where: {
                userId
            }
        })
        return categories
    } catch(err) {
        console.error(err)
        return {
            error: "Não foi possível buscar categorias do usuário."
        }
    }
}

export default {
    category_CREATE,
    category_LIST
}