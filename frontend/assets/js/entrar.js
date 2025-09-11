document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('login-form');

    // Se o formulário não existir na página, o script para.
    if (!loginForm) {
        return;
    }

    loginForm.addEventListener('submit', function(event) {
        // 1. Previne o comportamento padrão do formulário (recarregar a página)
        event.preventDefault();

        // 2. Pega o valor do campo de e-mail
        const emailInput = document.getElementById('email').value;

        // 3. Extrai um "nome" do e-mail para exibição
        // Ex: "usuario@email.com" se torna "usuario"
        // O método split('@')[0] divide o texto no "@" e pega a primeira parte.
        // O método charAt(0).toUpperCase() + slice(1) coloca a primeira letra em maiúsculo.
        const nomeUsuario = emailInput.split('@')[0];
        const nomeCapitalizado = nomeUsuario.charAt(0).toUpperCase() + nomeUsuario.slice(1);

        // 4. Cria o objeto do usuário que será salvo
        const userToLogin = {
            email: emailInput,
            nome: nomeCapitalizado // Salva o nome extraído do e-mail
        };

        // 5. Salva o usuário na sessão (localStorage) com a chave 'currentUser'
        localStorage.setItem('currentUser', JSON.stringify(userToLogin));

        // 6. Avisa o usuário e redireciona para a página principal
        alert('Login realizado com sucesso!');
        window.location.href = 'index.html'; // Redireciona para a home
    });
});








/*document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('login-form');

    // Se o formulário de login não existir nesta página, interrompe o script.
    if (!loginForm) {
        return;
    }

    loginForm.addEventListener('submit', function(event) {
        // 1. Previne o comportamento padrão do formulário
        event.preventDefault();

        // 2. Pega os valores dos campos de e-mail E SENHA
        const emailInput = document.getElementById('email').value;
        const senhaInput = document.getElementById('senha').value;

        // 3. Busca a lista de usuários cadastrados no localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        // 4. Procura por um usuário com o e-mail informado
        const foundUser = registeredUsers.find(user => user.email === emailInput);

        // 5. VALIDAÇÃO: Verifica se o usuário foi encontrado E se a senha está correta
        if (foundUser && foundUser.senha === senhaInput) {
            // SUCESSO NO LOGIN

            // Cria o objeto do usuário logado com os dados REAIS do usuário encontrado
            const userToLogin = {
                email: foundUser.email,
                nome: foundUser.nome
                // Adicione outras informações do usuário se houver (ex: id, foto, etc.)
            };

            // Salva o usuário ATUAL na sessão
            localStorage.setItem('currentUser', JSON.stringify(userToLogin));

            // Avisa e redireciona para a página de perfil ou principal
            alert(`Bem-vindo(a) de volta, ${foundUser.nome}!`);
            window.location.href = 'perfil.html';

        } else {
            // FALHA NO LOGIN
            alert('E-mail ou senha incorretos. Por favor, tente novamente.');
        }
    });
});*/