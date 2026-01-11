const beneficiarioService = require('../services/beneficiarioService');

async function listarBeneficiarioController(req, res) {
    try {
        const dados = await beneficiarioService.listarBeneficiarios();
        return res.status(200).json(dados);
    } catch (error) {
        console.error("Erro ao listar beneficiários:", error);
        return res.status(500).json({ erro: "Erro ao listar beneficiários no servidor." });
    }
}

async function registrarBeneficiarioController(req, res) {
    try {
        const resultado = await beneficiarioService.cadastrarBeneficiario(req.body);
        return res.status(201).json(resultado);
    } catch (error) {
        console.error("Erro ao registrar beneficiário:", error);
        return res.status(500).json({ erro: "Erro ao cadastrar beneficiário no servidor." });
    }
}

async function editar(req, res) {
    const { cpf } = req.params; // Captura o CPF da URL
    try {
        const resultado = await beneficiarioService.atualizarBeneficiario(cpf, req.body);
        return res.status(200).json(resultado);
    } catch (error) {
        console.error("Erro ao editar:", error);
        return res.status(500).json({ erro: "Erro ao editar beneficiário." });
    }
}

async function excluir(req, res) {
    const { cpf } = req.params; // Captura o CPF da URL
    try {
        const resultado = await beneficiarioService.deletarBeneficiario(cpf);
        return res.status(200).json(resultado);
    } catch (error) {
        console.error("Erro ao excluir:", error);
        return res.status(500).json({ erro: "Erro ao excluir beneficiário." });
    }
}

module.exports = { 
    listarBeneficiarioController, 
    registrarBeneficiarioController, 
    editar, 
    excluir 
};