const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middlewares/authMiddleware');

const doacaoController = require('../controllers/doacaoController');
const entregaController = require('../controllers/entregaController');
const beneficiarioController = require('../controllers/beneficiarioController');
const voluntarioController = require('../controllers/voluntarioController');

// --- AUTH ---
router.post('/auth/login', voluntarioController.login);
router.post('/auth/register', voluntarioController.registrar);

// --- ENTREGAS ---
router.get('/entrega/listar', entregaController.listarEntregaController);
router.delete('/entrega/excluir/:id', entregaController.excluirEntregaController);
router.post('/entrega/registrar', checkAuth, entregaController.registrarEntregaController);

// --- DOAÇÕES ---
router.get('/doacao/listar', checkAuth, doacaoController.listarDoacaoController);
router.post('/doacao/registrar', checkAuth, doacaoController.registrarDoacaoController);
router.get('/estoque/saldo', checkAuth, doacaoController.consultarSaldoController);

// --- BENEFICIÁRIOS ---
router.get('/beneficiario/listar', checkAuth, beneficiarioController.listarBeneficiarioController);
router.post('/beneficiario/registrar', checkAuth, beneficiarioController.registrarBeneficiarioController);
router.put('/beneficiario/editar/:cpf', checkAuth, beneficiarioController.editar);
router.delete('/beneficiario/excluir/:cpf', checkAuth, beneficiarioController.excluir);

module.exports = router;