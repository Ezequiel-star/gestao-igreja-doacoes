const entregaService = require('../services/entregaService');

async function registrarEntregaController(req, res) {
    try {
        // Captura o ID do usuário vindo do Token JWT
        const idVoluntario = req.user ? (req.user.id || req.user.id_voluntario) : null;
        const resultado = await entregaService.registrarEntrega(req.body, idVoluntario);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao registrar entrega." });
    }
}

async function listarEntregaController(req, res) {
    try {
        const entregas = await entregaService.listarEntregas();
        res.status(200).json(entregas);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao listar entregas." });
    }
}

async function excluirEntregaController(req, res) {
    try {
        await entregaService.excluirEntrega(req.params.id);
        res.status(200).json({ mensagem: "Excluído com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao excluir entrega." });
    }
}

module.exports = {
    registrarEntregaController,
    listarEntregaController,
    excluirEntregaController
};