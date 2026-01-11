const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const forgotLink = document.querySelector('.forgot-link');
const backToLogin = document.querySelector('.back-to-login');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

// DICA: Se estiver testando no PC, use 'http://localhost:3000/api' 
// Se for para publicar, use a do Render.
const API_URL = 'http://localhost:3000/api'; 

// --- NAVEGAÇÃO ---
if (registerLink) {
    registerLink.onclick = () => {
        wrapper.classList.remove('active-forgot');
        wrapper.classList.add('active');
    };
}
if (loginLink) {
    loginLink.onclick = () => wrapper.classList.remove('active');
}
if (forgotLink) {
    forgotLink.onclick = (e) => {
        e.preventDefault();
        wrapper.classList.remove('active');
        wrapper.classList.add('active-forgot');
    };
}
if (backToLogin) {
    backToLogin.onclick = (e) => {
        e.preventDefault();
        wrapper.classList.remove('active-forgot');
    };
}
if (btnPopup) {
    btnPopup.onclick = () => wrapper.classList.add('active-popup');
}
if (iconClose) {
    iconClose.onclick = () => {
        wrapper.classList.remove('active-popup');
        setTimeout(() => {
            wrapper.classList.remove('active');
            wrapper.classList.remove('active-forgot');
        }, 500);
    };
}

// --- FUNÇÕES DE ALERTA ---
function showAlert(elementId, message, type) {
    const alertDiv = document.getElementById(elementId);
    if (!alertDiv) return;
    alertDiv.innerText = message;
    alertDiv.className = 'alert-msg ' + (type === 'success' ? 'alert-success' : 'alert-error');
    
    // Remove o alerta após 4 segundos
    setTimeout(() => { 
        alertDiv.className = 'alert-msg'; 
        alertDiv.innerText = '';
    }, 4000);
}

// --- CHAMADAS À API ---

async function fazerLogin(email, senha) {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senhaPura: senha })
        });
        const dados = await res.json();
        if (res.ok) {
            localStorage.setItem('jwtToken', dados.token);
            showAlert('msgLogin', '✅ Login realizado!', 'success');
            setTimeout(() => { window.location.href = 'menuprincipal.html'; }, 1000);
        } else {
            showAlert('msgLogin', '❌ ' + (dados.erro || 'Erro no login.'), 'error');
        }
    } catch (e) { showAlert('msgLogin', '⚠️ Servidor offline.', 'error'); }
}

async function registrarUsuario(nome, email, senha) {
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
        const dados = await res.json();
        if (res.ok) {
            showAlert('msgReg', '✅ Cadastro realizado! Faça login.', 'success');
            setTimeout(() => { wrapper.classList.remove('active'); }, 2000);
        } else {
            showAlert('msgReg', '❌ ' + (dados.erro || 'Erro no cadastro.'), 'error');
        }
    } catch (e) { showAlert('msgReg', '⚠️ Erro de conexão.', 'error'); }
}

async function esqueciSenha(email) {
    try {
        const res = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const dados = await res.json();
        if (res.ok) {
            showAlert('msgForgot', '✅ Instruções enviadas!', 'success');
        } else {
            showAlert('msgForgot', '❌ ' + (dados.erro || 'E-mail não encontrado.'), 'error');
        }
    } catch (e) { showAlert('msgForgot', '⚠️ Servidor offline.', 'error'); }
}

// --- VÍNCULO COM OS FORMULÁRIOS (SUBMITS) ---
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('loginForm');
    const formForgot = document.getElementById('forgotForm');
    const formReg = document.getElementById('registerForm');

    if (formLogin) {
        formLogin.onsubmit = (e) => {
            e.preventDefault();
            fazerLogin(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value);
        };
    }
    if (formForgot) {
        formForgot.onsubmit = (e) => {
            e.preventDefault();
            esqueciSenha(document.getElementById('forgotEmail').value);
        };
    }
    if (formReg) {
        formReg.onsubmit = (e) => {
            e.preventDefault();
            registrarUsuario(
                document.getElementById('regUsername').value,
                document.getElementById('regEmail').value,
                document.getElementById('regPassword').value
            );
        };
    }
});