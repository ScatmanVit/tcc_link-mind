import PrivateUserServiceCategories from '../../../../services/private/user/categories/private.categories.user.services.js'
import { findOneUser } from '../../../../utils/utils.js'


async function category_create_Controller_POST(req, res) {
	const userId = req.user?.id
	const { dataNewCategory } = req.body

	if (!userId) {
		return res.status(401).json({
			error: "Identificador do usuário não recebido"
		})
	}
    if (!Array.isArray(dataNewCategory) || dataNewCategory.length === 0) {
		console.log(dataNewCategory)
		return res.status(400).json({
			error: "Forneça um nome para a nova categoria."
		})
    }
	try {
		const userExist = await findOneUser("", userId)
		if (!userExist) {
			return res.status(404).json({
				error: "Usuário não encontrado. Não é possível criar categoria."
			})
		} 
		const newCategory = await PrivateUserServiceCategories
			.category_CREATE(dataNewCategory, userId)
		if (newCategory?.error) {
			return res.status(newCategory.statusCode || 500).json({
				error: newCategory?.error
			})
		}
		return res.status(201).json({
			success: true,
			message: "Categoria criada com sucesso!",
			category: newCategory
		})
		
	} catch (err) {
		console.error("Erro no servidor, [ CRIAÇÃO CATEGORIA ]", err)
		return res.status(500).json({
			error: "Ocorreu um erro no servidor"
		})
	}
}

async function categories_list_Controller_GET(req, res) {
	const userId = req.user?.id
	if (!userId) {
		return res.status(400).json({
			error: "Identificador do usuário não recebido"
		})
	}
	try {
		const userExist = await findOneUser("", userId)
		if (!userExist) {
			return res.status(404).json({
				error: "Usuário não encontrado. Não é possível criar categoria."
			})
		}
		const categoriesList = await PrivateUserServiceCategories
			.category_LIST(userId)
		if (categoriesList?.error) {
			return res.status(categoriesList.statusCode || 500).json({
				error: categoriesList.error
			})
		}
		return res.status(200).json({
			success: true,
			message: categoriesList.length > 0 
				? "Categorias listadas com sucesso!" 
				: "Não há categorias para listar desse usuário.",
			categories: categoriesList.length > 0 
				? categoriesList.map(({ userId, ...rest }) => rest) 
				: []
		})
	} catch(err) {
		console.error("Erro no servidor, [ LISTAGEM DE CATEGORIAS ]", err)
		return res.status(500).json({
			error: "Ocorreu um erro no servidor."
		})
	}	
}


export default {
	category_create_Controller_POST,
	categories_list_Controller_GET
}