// Execute este código UMA VEZ no console do navegador para criar um usuário de teste
function criarUsuarioDeTeste() {
    const usuariosCadastrados = [
        {
            nome: "Ana Silva",
            email: "teste@email.com",
            senha: "1234" // Em um app real, a senha seria criptografada
        }
    ];

    // Salva a lista de usuários no localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(usuariosCadastrados));
    console.log('Usuário de teste criado com sucesso!');
}

// Chame a função se quiser criar o usuário agora
// criarUsuarioDeTeste();