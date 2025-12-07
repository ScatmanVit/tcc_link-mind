import PrivateUserServiceAnnotations from '../../../../services/private/user/annotation/private.annotations.user.services.js'
import { findOneUser } from '../../../../utils/utils.js'

async function create_annotation_Controller_POST(req, res) {
    const userId = req.user?.id
    const { title, annotation, categoriaId } = req.body

    if (!userId) {
        return res.status(400).json({
            error: "Id do usuário não fornecido para a criação da nova anotação"
        })
    } 
    if (!title || !annotation) {
        return res.status(400).json({
            error: "O Título e a anotação deve ter sido escritos para salvar anotação."
        })
    }
    try {
        const userExist = await findOneUser("", userId)
        if (!userExist) {
            return res.status(404).json({
                error: "Usuário não encontrado. Não é possível criar anotação."
            })
        }
        const annotationCreated = await PrivateUserServiceAnnotations
            .annotation_CREATE({
                title,
                annotation,
                categoriaId
            },
            userId
        )
        if (annotationCreated?.error) {
            return res.status(annotationCreated.statusCode || 500).json({
                error: annotationCreated.error
            })
        } else {
            return res.status(201).json({
                success: true,
                message: "Anotação criada com sucesso!",
                annotationCreated: annotationCreated
            })
        }
    } catch (err) {
        console.error("Ocorreu um erro no servidor [ CREATE ANNOTATION ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })
    }
 }

async function delete_annotation_Controller_DELETE(req, res) {
    const userId = req.user?.id
    const annotationId = req.params.id


    if (!userId) {
        return res.status(401).json({
            error: "Id do usuário não fornecido."
        })
    }
    if (!annotationId) {
        return res.status(401).json({
            error: "Id da anotação não fornecido."
        })
    }
    try {
        const annotationDeleted = await PrivateUserServiceAnnotations
            .annotation_DELETE(userId, annotationId)
        if (annotationDeleted?.error) {
            return res.status(annotationDeleted.statusCode || 500).json({
                error: annotationDeleted.error
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "Anotação deletada com sucesso!",

            })
        }
    } catch (err) {
        console.error("Ocorreu um erro no servidor [ DELETE ANNOTATION ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })
    }
}
 

 async function list_annotation_Controller_GET(req, res) {
    const userId = req.user?.id
    if (!userId) {
        return res.status(400).json({
            error: "Id do usuário não fornecido para a criação da listagem das anotações."
        })
    }
    try {
        const userExist = await findOneUser("", userId)
        if (!userExist) {
            return res.status(404).json({
                error: "Usuário não encontrado. Não é possível criar anotação."
            })
        }
        const annotationsList = await PrivateUserServiceAnnotations
            .annotation_LIST(userId)
        if (annotationsList?.error) {
            return res.status(annotationsList.statusCode || 500).json({
                error: annotationsList.error
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "Anotações listadas com sucesso!",
                annotations: annotationsList
            })
        }
    } catch (err) {
        console.error("Ocorreu um erro no servidor [ LIST ANNOTATIONS ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })
    }
}


async function update_annotation_Controller_UPDATE(req, res) {
    const userId = req.user?.id
    const annotationId = req.params.id
    const {
        newTitle,
        newAnnotation,
        newCategoriaId
    } = req.body
    if (!req.body) {
        return res.status(400).json({
            error: "Campos obrigatórios não recebidos."
        })
    }
    
    try {
        const userExist = await findOneUser("", userId)
        if (!userExist) {
            return res.status(404).json({
                error: "Usuário não encontrado. Não é possível criar anotação."
            })
        }

        const annotationUpdated = await PrivateUserServiceAnnotations
                .annotation_UPDATE({
                    userId,
                    annotationId,
                    newTitle,
                    newAnnotation,
                    newCategoriaId
                })
        if (annotationUpdated?.error) {
            return res.status(annotationUpdated.statusCode || 500).json({
                error: annotationUpdated.error
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "Anotação alterada com sucesso!",
                annotationUpdated
            })
        }
    } catch (err) {
        console.error("Ocorreu um erro no servidor [ UPDATE ANNOTATION ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })
    }
}


 export default {
    create_annotation_Controller_POST,
    list_annotation_Controller_GET,
    delete_annotation_Controller_DELETE,
    update_annotation_Controller_UPDATE
 }