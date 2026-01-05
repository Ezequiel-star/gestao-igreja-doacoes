
// src/controllers/authController.js
const { authenticateVoluntario, registerVoluntario } = require('../services/authService');

// --- FUNÇÃO DE LOGIN ---
async function login(req, res) {
    // Pegamos os dados do body do Postman
    // Adicionei senhaPura como garantia caso o Postman envie com esse nome
    const { email, senha, senhaPura } = req.body; 
    const senhaFinal = senha || senhaPura;

    try {
        // Esse log vai aparecer no seu terminal do VS Code assim que clicar em SEND
        console.log(`🚀 Tentando login para o email: ${email}`);

        const resultado = await authenticateVoluntario(email, senhaFinal);

        if (resultado.error) {
            console.log(`⚠️ Falha no login: ${resultado.error}`);
            return res.status(401).json({ erro: resultado.error });
        }

        console.log("✅ Login bem-sucedido! Token gerado.");
        // Retorna o token e o nível de acesso em caso de sucesso
        return res.status(200).json(resultado);

    } catch (error) {
        console.error("❌ Erro crítico no Controller de Login:", error);
        return res.status(500).json({ erro: "Erro interno do servidor." });
    }
}

// --- FUNÇÃO DE REGISTRO ---
async function register(req, res) {
    const dados = req.body; 

    try {
        console.log(`📝 Tentando registrar novo voluntário: ${dados.email}`);
        const resultado = await registerVoluntario(dados);

        if (resultado.error) {
            return res.status(400).json({ erro: resultado.error });
        }

        return res.status(201).json({ mensagem: "Voluntário registrado com sucesso!" });

    } catch (error) {
        console.error("❌ Erro no Controller de Registro:", error);
        return res.status(500).json({ erro: "Erro ao processar o cadastro." });
    }
}

// Exportação para as rotas utilizarem
module.exports = { login, register };