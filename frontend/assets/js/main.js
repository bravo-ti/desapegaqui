// Aguarda o conteúdo da página ser completamente carregado
document.addEventListener("DOMContentLoaded", function() {
    
    // Encontra o placeholder do menu
    const menuPlaceholder = document.getElementById('menu-placeholder');

    // Se o placeholder existir, busca o conteúdo do menu.html
    if (menuPlaceholder) {
        fetch('menu.html') // O caminho para o seu arquivo de menu
            .then(response => {
                // Verifica se a requisição foi bem-sucedida
                if (!response.ok) {
                    throw new Error('Erro ao carregar o menu: ' + response.status);
                }
                return response.text(); // Converte a resposta para texto (HTML)
            })
            .then(data => {
                // Insere o HTML do menu dentro do placeholder
                menuPlaceholder.innerHTML = data;
            })
            .catch(error => {
                console.error('Não foi possível carregar o menu:', error);
                menuPlaceholder.innerHTML = '<p style="color:red;">Erro ao carregar o menu.</p>';
            });
    }
});