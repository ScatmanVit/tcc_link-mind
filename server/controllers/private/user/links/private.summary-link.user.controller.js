import PrivateUserServiceSummaryLink from '../../../../services/private/user/links/private.summary-link.user.services.js'
import { findOneUser } from '../../../../utils/utils.js'


async function summary_link_Controller(req, res) {
    const { linkId, linkUrl, userId } = req.body
    if (!userId) { 
        return res.status(401).json({
            error: "Usuário não autenticado. Token inválido ou ausente."
        })
    }
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
        const summaryLink = await PrivateUserServiceSummaryLink
            .summary_link(userId, linkUrl, linkId, userExist.name)

        if (summaryLink?.error) {
            return res.status(summaryLink.statusCode || 500).json({
                error: summaryLink.error
            })
        }

        return res.status(200).json({
            summary: summaryLink.summary,
            summaryId: summaryLink.summaryId
        })

    } catch(err) {
        console.error("Ocorreu um erro no servidor [ SUMMARY LINK ]", err)
        return res.status(500).json({
            error: "Ocorreu um erro no servidor."
        })
    }
}

async function summary_link_sendEmail_Controller(req, res) {

}

export default {
    summary_link_Controller,
    summary_link_sendEmail_Controller
}