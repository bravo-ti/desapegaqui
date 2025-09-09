// Seleciona o formulário de login pelo ID que adicionamos
const loginForm = document.getElementById('login-form');

// Adiciona um "ouvinte" para o evento de 'submit' (envio) do formulário
loginForm.addEventListener('submit', function(event) {
  
  // 1. Previne o comportamento padrão do formulário, que é recarregar a página
  event.preventDefault();

  // 2. Pega os valores dos campos de e-mail e senha
  const emailInput = document.getElementById('email');
  const email = emailInput.value;

  // 3. Cria um objeto para representar o usuário logado
  // (Em um app real, você primeiro validaria a senha com um servidor)
  const user = {
    email: email,
    // Você pode adicionar mais informações que venham do seu banco de dados
    name: 'Usuário Exemplo' 
  };

  // 4. Salva o objeto do usuário no localStorage
  // IMPORTANTE: localStorage só armazena texto (strings).
  // Por isso, convertemos o objeto 'user' para uma string no formato JSON.
  localStorage.setItem('loggedInUser', JSON.stringify(user));

  // 5. Redireciona o usuário para a página principal (home.html)
  // Isso só acontece DEPOIS que os dados foram salvos.
  window.location.href = 'perfil.html';
});