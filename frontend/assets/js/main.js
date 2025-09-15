document.addEventListener("DOMContentLoaded", function () {

    // <-- ADICIONADO: Define os nossos 2 usuários de teste aqui no topo
    const userAnunciante = { id: 101, nome: 'Ana Anunciante' };
    const userComprador = { id: 202, nome: 'Beto Comprador' };

    const loadMenu = () => {
        const menuPlaceholder = document.getElementById('menu-placeholder');
        if (!menuPlaceholder) return;

        fetch('menu.html') 
            .then(response => response.ok ? response.text() : Promise.reject('Erro ao carregar o menu'))
            .then(data => {
                menuPlaceholder.innerHTML = data;
                updateMenuState();
            })
            .catch(error => {
                console.error('Não foi possível carregar o menu:', error);                  
                menuPlaceholder.innerHTML = '<p style="color:red; text-align:center;">Erro: Menu não pôde ser carregado.</p>';
            });
    };

    // Função que verifica o login e ajusta o menu
    const updateMenuState = () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        const registerLink = document.getElementById('register-link');
        const loginLink = document.getElementById('login-link'); // Este agora é o dropdown
        const userGreeting = document.getElementById('user-greeting');
        const usernameDisplay = document.getElementById('username-display');
        const logoutLink = document.getElementById('logout-link');

        if (currentUser && currentUser.nome) {
            // --- ESTADO LOGADO ---
            if (usernameDisplay) usernameDisplay.textContent = currentUser.nome;
            if (userGreeting) userGreeting.style.display = 'block';
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            if (logoutLink) logoutLink.addEventListener('click', logout);

        } else {
            // --- ESTADO DESLOGADO ---
            if (userGreeting) userGreeting.style.display = 'none';
            if (loginLink) loginLink.style.display = 'block';
            if (registerLink) registerLink.style.display = 'block';

            // <-- ATUALIZADO: Adiciona eventos para os novos botões do dropdown
            const loginAnuncianteBtn = document.getElementById('login-anunciante-btn');
            const loginCompradorBtn = document.getElementById('login-comprador-btn');

            if (loginAnuncianteBtn) {
                loginAnuncianteBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    login(userAnunciante); // Loga como Anunciante
                });
            }
            if (loginCompradorBtn) {
                loginCompradorBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    login(userComprador); // Loga como Comprador
                });
            }
        }
    };

    // <-- ATUALIZADO: Função de login agora aceita um objeto de usuário
    const login = (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert(`Você entrou como ${user.nome}!`);
        // Recarrega a página para garantir que todos os scripts vejam o novo usuário
        window.location.reload(); 
    };

    // Função de Logout (sempre previne o default e redireciona no final)
    const logout = (e) => {
        if(e) e.preventDefault();
        localStorage.removeItem('currentUser');
        alert('Você saiu da sua conta.');
        window.location.href = 'index.html';
    };

    loadMenu();
});