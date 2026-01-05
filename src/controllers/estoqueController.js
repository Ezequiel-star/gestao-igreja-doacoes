const entregaService = require('../services/entregaService');

async function registrar(req, res) {
    try {
        const resultado = await entregaService.registrarEntrega(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao registrar." });
    }
}

async function listar(req, res) {
    try {
        const entregas = await entregaService.listarEntregas();
        res.status(200).json(entregas);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar histórico." });
    }
}

async function excluir(req, res) {
    try {
        await entregaService.excluirEntrega(req.params.id);
        res.status(200).json({ mensagem: "Excluído!" });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao excluir." });
    }
}

module.exports = { registrar, listar, excluir };