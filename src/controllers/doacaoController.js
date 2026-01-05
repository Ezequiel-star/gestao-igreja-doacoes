const doacaoService = require('../services/doacaoService');

async function registrarDoacaoController(req, res) {
    try {
        // req.user.id é extraído do token pelo middleware checkAuth
        const resultado = await doacaoService.registrarDoacao(req.body, req.user.id);
        res.status(201).json(resultado);
    } catch (error) {
        console.error("Erro ao registrar doação:", error);
        res.status(500).json({ erro: "Erro interno ao registrar doação." });
    }
}

async function listarDoacaoController(req, res) {
    try {
        const doacoes = await doacaoService.listarDoacoes();
        res.status(200).json(doacoes);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao listar doações." });
    }
}

async function consultarSaldoController(req, res) {
    try {
        const saldo = await doacaoService.consultarSaldoEstoque();
        res.status(200).json(saldo);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao consultar saldo." });
    }
}

module.exports = {
    registrarDoacaoController,
    listarDoacaoController,
    consultarSaldoController
};