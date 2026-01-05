// ----------------------------------------------------
// 0. VARIÁVEIS DE CONTROLE DE UI (POP-UP E NAVEGAÇÃO)
// ----------------------------------------------------
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const forgotLink = document.querySelector('.forgot-link');
const backToLogin = document.querySelector('.back-to-login');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

// --- NAVEGAÇÃO ENTRE TELAS ---
if (registerLink) {
    registerLink.addEventListener('click', () => {
        wrapper.classList.remove('active-forgot');
        wrapper.classList.add('active');
    });
}

if (loginLink) {
    loginLink.addEventListener('click', () => {
        wrapper.classList.remove('active');
    });
}

if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.remove('active');
        wrapper.classList.add('active-forgot');
    });
}

if (backToLogin) {
    backToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.remove('active-forgot');
    });
}

if (btnPopup) {
    btnPopup.addEventListener('click', () => {
        wrapper.classList.add('active-popup');
    });
}

if (iconClose) {
    iconClose.addEventListener('click', () => {
        wrapper.classList.remove('active-popup');
        setTimeout(() => {
            wrapper.classList.remove('active');
            wrapper.classList.remove('active-forgot');
        }, 500);
    });
}

// ----------------------------------------------------
// 1. FUNÇÕES DE UTILIDADE (ALERTAS)
// ----------------------------------------------------

function showAlert(elementId, message, type) {
    const alertDiv = document.getElementById(elementId);
    if (!alertDiv) return;
    
    alertDiv.innerText = message;
    alertDiv.className = 'alert-msg ' + (type === 'success' ? 'alert-success' : 'alert-error');
    
    setTimeout(() => {
        alertDiv.className = 'alert-msg'; 
    }, 4000);
}

// ----------------------------------------------------
// 2. FUNÇÕES PRINCIPAIS (CONEXÃO COM API/BANCO)
// ----------------------------------------------------

async function fazerLogin(email, senha) {
    // URL garantindo o prefixo /api que está no seu server.js
    const url = 'http://localhost:3000/api/auth/login'; 
    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Enviando como seu backend espera receber
            body: JSON.stringify({ email, senhaPura: senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            // Salva o Token para as próximas requisições (Doação, Entrega, etc)
            localStorage.setItem('jwtToken', dados.token);
            localStorage.setItem('nivelAcesso', dados.nivel);
            showAlert('msgLogin', '✅ Login realizado com sucesso!', 'success');
            
            setTimeout(() => {
                window.location.href = 'menuprincipal.html'; 
            }, 1000);
        } else {
            showAlert('msgLogin', '❌ ' + (dados.erro || 'E-mail ou senha incorretos.'), 'error');
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        showAlert('msgLogin', '⚠️ Erro ao conectar ao servidor.', 'error');
    }
}

async function fazerCadastro(nome, email, senha) {
    const url = 'http://localhost:3000/api/auth/register'; 
    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senhaPura: senha, nivelAcesso: 'Comum' })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            showAlert('msgReg', '✅ Cadastro realizado! Faça login.', 'success');
            setTimeout(() => { wrapper.classList.remove('active'); }, 2000);
        } else {
            showAlert('msgReg', '❌ Erro: ' + dados.erro, 'error');
        }
    } catch (erro) {
        showAlert('msgReg', '⚠️ Erro ao conectar ao servidor.', 'error');
    }
}

// ----------------------------------------------------
// 3. VÍNCULO DOS FORMULÁRIOS
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('loginForm');
    const formRegistro = document.getElementById('registerForm');

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value; 
            const senha = document.getElementById('loginPassword').value; 
            fazerLogin(email, senha);
        });
    }

    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('regUsername').value; 
            const email = document.getElementById('regEmail').value; 
            const senha = document.getElementById('regPassword').value; 
            fazerCadastro(nome, email, senha);
        });
    }
});