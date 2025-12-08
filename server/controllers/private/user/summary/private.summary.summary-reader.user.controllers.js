import PrivateUserServiceSummary from '../../../../services/private/user/summary/private.summary-reader.user.services.js'
import { findOneUser } from '../../../../utils/utils.js'


async function summary_link_Controller(req, res) {
    const userId = req.user?.id
    const { 
        instructionsFromUser, 
        linkUrl, 
        linkType, 
        linkId, 
        categoriaId, 
     } = req.body
    if (!userId) { 
        return res.status(401).json({
            error: "Usuário não autenticado. Token inválido ou ausente."
        })
    }
    console.log(req.body)
    if (!linkId) {
        return res.status(401).json({
            error:"Id do link não foi fornecido para ser resumido."
        })
    }
    if(!linkUrl) {
        return res.status(401).json({
            error: "A url do link não foi fornecida."
        })
    }
    try {
        const userExist = await findOneUser("", userId)
        if (!userExist) {
            return res.status(404).json({
                error: "Usuário não encontrado. Não é possível resumir Link"
            })
        }
        const summaryLink = await PrivateUserServiceSummary
            .summary_CREATE(
                instructionsFromUser, 
                userId, 
                linkUrl, 
                linkType, 
                linkId, 
                categoriaId, 
                userExist.name)

        if (summaryLink?.error) {
            return res.status(summaryLink.statusCode || 500).json({
                error: summaryLink.error
            })
        }

        return res.status(200).json({
            success: true,
            message: "Link resumido com sucesso!",
            summary: summaryLink.summary,
        })

    } catch(err) {
        console.error("Ocorreu um erro no servidor [ SUMMARY LINK ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })
    }
}

export default {
    summary_link_Controller
}