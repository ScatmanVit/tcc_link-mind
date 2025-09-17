 
function isAdmin(req, res, next) {
	if (!req.user) {
		return res.status(401).json({
			error: 'Usuário não autenticado.'
		})
	}
	if (req.user.role != 'ADMIN') {
		return res.status(403).json({
			error: "Acesso negado: Somente admins."
		})
	}
	next()
}

export default isAdmin