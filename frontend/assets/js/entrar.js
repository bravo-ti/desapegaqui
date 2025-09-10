// Adicionado para seguir a mesma boa prática do main.js
document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('login-form');

    // Se o formulário de login não existir nesta página, não faz nada.
    if (!loginForm) {
        return;
    }

    loginForm.addEventListener('submit', function(event) {
        // 1. Previne o comportamento padrão do formulário
        event.preventDefault();

        // 2. Pega o valor do campo de e-mail
        const emailInput = document.getElementById('email');
        const email = emailInput.value;

        // 3. Cria um objeto para representar o usuário logado
        const user = {
            email: email,
            // CORRIGIDO: A propriedade agora é 'nome' para ser compatível com main.js
            nome: 'Usuário Exemplo' 
        };

        // 4. Salva o objeto do usuário no localStorage
        // CORRIGIDO: A chave agora é 'currentUser' para ser compatível com main.js
        localStorage.setItem('currentUser', JSON.stringify(user));

        // 5. Redireciona o usuário para a página de perfil
        alert('Login realizado com sucesso!');
        window.location.href = 'perfil.html';
    });

});