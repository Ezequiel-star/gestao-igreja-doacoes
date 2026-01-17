// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.wrapper');
    const btnPopup = document.querySelector('.btnLogin-popup');
    const iconClose = document.querySelector('.icon-close');
    const forgotLink = document.querySelector('.forgot-link');
    const backToLogin = document.querySelector('.back-to-login');

    // URL da tua API no Render
    const API_URL = 'https://gestao-igreja-doacoes.onrender.com/api';

    // 1. FUNÇÃO PARA ABRIR O FORMULÁRIO (BOTÃO ACESSAR)
    if (btnPopup) {
        btnPopup.addEventListener('click', () => {
            console.log("Botão Acessar clicado!"); // Debug no console
            wrapper.classList.add('active-popup');
        });
    }

    // 2. FUNÇÃO PARA FECHAR O FORMULÁRIO (O X)
    if (iconClose) {
        iconClose.addEventListener('click', () => {
            wrapper.classList.remove('active-popup');
            wrapper.classList.remove('active-forgot');
        });
    }

    // 3. NAVEGAÇÃO ENTRE LOGIN E RECUPERAÇÃO
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            wrapper.classList.add('active-forgot');
        });
    }

    if (backToLogin) {
        backToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            wrapper.classList.remove('active-forgot');
        });
    }

    // 4. LÓGICA DE LOGIN (A QUE ESTAVA A FALHAR)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            
            // Captura os elementos de mensagem e inputs
            const msgLogin = document.getElementById('msgLogin');
            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');

            // Feedback visual de carregamento
            msgLogin.style.color = "#fff";
            msgLogin.innerText = "A verificar dados...";

            try {
                const res = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        email: emailInput.value, 
                        senhaPura: passwordInput.value 
                    })
                });

                const dados = await res.json();

                if (res.ok) {
                    // Guarda o token JWT
                    localStorage.setItem('jwtToken', dados.token);
                    msgLogin.style.color = "#87ffad";
                    msgLogin.innerText = "✅ Login bem-sucedido!";
                    
                    // Redireciona após 1 segundo
                    setTimeout(() => {
                        window.location.href = 'menuprincipal.html';
                    }, 1000);
                } else {
                    msgLogin.style.color = "#ff4d4d";
                    msgLogin.innerText = "❌ " + (dados.erro || "E-mail ou senha incorretos");
                }
            } catch (err) {
                console.error("Erro na requisição:", err);
                msgLogin.style.color = "#ff4d4d";
                msgLogin.innerText = "⚠️ Erro: Servidor Offline";
            }
        };
    }
});