// Preparado para interações futuras
document.addEventListener("DOMContentLoaded", () => {
  console.log("Página de boas-vindas carregada com sucesso!");
});

// Conteúdo do arquivo: assets/js/boas-vindas.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Simula a criação de um usuário que acabou de se cadastrar.
    // Em um sistema real, esses dados viriam da página de cadastro.
    const novoUsuario = {
        nome: "Visitante",
        email: "visitante@desapegaqui.com"
    };

    // 2. Salva o novo usuário como o usuário logado no localStorage.
    // Esta é a parte crucial!
    localStorage.setItem('currentUser', JSON.stringify(novoUsuario));

    // 3. Redireciona para a página principal após um breve intervalo.
    // Damos 3 segundos (3000 milissegundos) para o usuário ler a mensagem de boas-vindas.
    console.log('Bem-vindo! Redirecionando para a página principal em 3 segundos...');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000); // 3000 ms = 3 segundos
});