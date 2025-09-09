document.addEventListener("DOMContentLoaded", function() {
    
    // Função principal para carregar o menu e depois atualizar seu estado
    const loadMenu = () => {
        const menuPlaceholder = document.getElementById('menu-placeholder');
        if (!menuPlaceholder) return; // Se não houver placeholder, não faz nada

        // O caminho para o seu menu. Ajuste se for diferente.
        fetch('../pages/menu.html') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar o menu');
                }
                return response.text();
            })
            .then(data => {
                menuPlaceholder.innerHTML = data;
                // Após o menu ser injetado na página, chamamos a função para verificar o login
                updateMenuState();
            })
            .catch(error => {
                console.error('Não foi possível carregar o menu:', error);
            });
    };

    // Função que verifica o login e ajusta o menu
    const updateMenuState = () => {
        // Pega o usuário do localStorage usando a chave CORRETA: 'currentUser'
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // Elementos do menu para visitantes
        const loginLink = document.getElementById('login-link');
        const registerLink = document.getElementById('register-link');
        
        // Elementos do menu para usuários logados
        const userGreeting = document.getElementById('user-greeting');
        const usernameDisplay = document.getElementById('username-display');
        const logoutLink = document.getElementById('logout-link');

        if (currentUser && currentUser.nome) {
            // --- ESTADO LOGADO ---
            
            // 1. Mostra o nome do usuário
            if (usernameDisplay) {
                usernameDisplay.textContent = currentUser.nome;
            }

            // 2. Mostra os links de "Olá, [Nome]" e "Sair"
            if (userGreeting) userGreeting.style.display = 'list-item';
            if (logoutLink) logoutLink.style.display = 'list-item';

            // 3. Esconde os links de "Entrar" e "Cadastrar-se"
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            
            // 4. Adiciona a funcionalidade de logout ao botão "Sair"
            if (logoutLink) {
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
        } else {
            // --- ESTADO DESLOGADO ---

            // 1. Esconde os links de usuário logado
            if (userGreeting) userGreeting.style.display = 'none';
            if (logoutLink) logoutLink.style.display = 'none';
            
            // 2. Mostra os links de visitante
            if (loginLink) loginLink.style.display = 'list-item';
            if (registerLink) registerLink.style.display = 'list-item';
        }
    };

    // Função para fazer o logout do usuário
    const logout = () => {
        // Remove a chave 'currentUser' do localStorage
        localStorage.removeItem('currentUser');
        // Redireciona para a página inicial para atualizar o estado
        alert('Você saiu da sua conta.');
        window.location.href = 'index.html'; 
    };

    // Inicia todo o processo carregando o menu
    loadMenu();
});