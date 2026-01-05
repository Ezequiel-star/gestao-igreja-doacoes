const voluntarioService = require('../services/voluntarioService');

async function login(req, res) {
    // Pegando senhaPura do corpo da requisição
    const { email, senhaPura } = req.body;
    try {
        const resultado = await voluntarioService.autenticarVoluntario(email, senhaPura);
        if (resultado.erro) {
            return res.status(401).json({ erro: resultado.erro });
        }
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ erro: "Erro interno no servidor." });
    }
}

async function registrar(req, res) {
    try {
        const resultado = await voluntarioService.cadastrarVoluntario(req.body);
        if (resultado.erro) return res.status(400).json({ erro: resultado.erro });
        return res.status(201).json(resultado);
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao registrar voluntário." });
    }
}

module.exports = { login, registrar };
