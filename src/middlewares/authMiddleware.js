const jwt = require('jsonwebtoken');
const JWT_SECRET = 'SUA_CHAVE_SECRETA_MUITO_FORTE'; 

function checkAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // PADRONIZAÇÃO: Anexamos ao 'req.user' para que os controllers 
        // encontrem o ID independente de como foram escritos.
        req.user = {
            id: decoded.id_voluntario,
            nivel: decoded.nivel
        };

        // Mantemos também o que você já tinha para compatibilidade
        req.voluntarioId = decoded.id_voluntario;
        req.nivelAcesso = decoded.nivel;

        next();
    } catch (err) {
        return res.status(403).json({ erro: 'Token inválido ou expirado.' });
    }
}

module.exports = { checkAuth };