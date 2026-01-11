const authService = require('../services/authService');
const pool = require('../config/db'); 

async function login(req, res) {
    const { email, senha, senhaPura } = req.body; 
    const senhaFinal = senha || senhaPura;
    try {
        const resultado = await authService.authenticateVoluntario(email, senhaFinal);
        if (resultado.error) return res.status(401).json({ erro: resultado.error });
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ erro: "Erro de conexão com o banco." });
    }
}

async function register(req, res) {
    try {
        const resultado = await authService.registerVoluntario(req.body);
        if (resultado.error) return res.status(400).json({ erro: resultado.error });
        return res.status(201).json({ mensagem: "Registrado com sucesso!" });
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao cadastrar." });
    }
}

async function forgotPassword(req, res) {
    const { email } = req.body;
    try {
        console.log(`🔍 Verificando: ${email}`);
        const [rows] = await pool.execute('SELECT nome FROM VOLUNTARIO WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ erro: "E-mail não encontrado." });
        }
        
        return res.status(200).json({ mensagem: "E-mail validado com sucesso!" });
    } catch (error) {
        console.error("❌ Erro na recuperação:", error.message);
        return res.status(500).json({ erro: "Banco instável. Tente novamente." });
    }
}

async function resetPassword(req, res) {
    const { email, novaSenha } = req.body;
    try {
        const [result] = await pool.execute('UPDATE VOLUNTARIO SET senha = ? WHERE email = ?', [novaSenha, email]);
        if (result.affectedRows === 0) return res.status(404).json({ erro: "Usuário não encontrado." });
        return res.status(200).json({ mensagem: "Senha atualizada!" });
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao atualizar senha." });
    }
}

module.exports = { login, register, forgotPassword, resetPassword };