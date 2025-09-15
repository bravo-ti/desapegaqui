document.addEventListener('DOMContentLoaded', () => {
    
    const itemForm = document.getElementById('item-form');

    // Se o formulário não existir na página, interrompe o script
    if (!itemForm) {
        return;
    }

    itemForm.addEventListener('submit', (event) => {
        // Previne o comportamento padrão do formulário (que seria recarregar a página)
        event.preventDefault();

        // <-- ADICIONADO: Pega o usuário logado do localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // <-- ADICIONADO: Garante que apenas usuários logados possam anunciar
        if (!currentUser || !currentUser.id) {
            alert('Você precisa estar logado para anunciar um item!');
            // Opcional: redirecionar para a página de login
            // window.location.href = 'entrar.html'; 
            return; // Interrompe a execução da função
        }

        // 1. Coletar os dados do formulário
        const formData = new FormData(itemForm);

        const novoAnuncio = {
            id: 'anuncio-' + Date.now(),
            titulo: formData.get('itemTitulo'),
            detalhes: formData.get('itemDetalhes'),
            valor: parseFloat(formData.get('itemValor')).toFixed(2),
            categoria: formData.get('itemCategoria'),
            expiracaoDias: parseInt(formData.get('itemExpiracao')),
            dataCadastro: new Date().toISOString(),

            // --- Parte da Localização ---
            itemCep: formData.get('itemCep'),
            itemBairro: formData.get('itemBairro'),
            itemCidade: formData.get('itemCidade'),
            itemEstado: formData.get('itemEstado'),
            
            // <-- ADICIONADO: As duas novas propriedades para o ciclo de vida do item
            ownerId: currentUser.id, // Salva o ID do dono do item
            status: 'ativo'          // Define o status inicial como 'ativo'
        };

        // 2. Processar a imagem
        const fotoInput = document.getElementById('item-foto');
        const fotoFile = fotoInput.files[0];

        if (fotoFile) {
            const reader = new FileReader();

            reader.onloadend = () => {
                novoAnuncio.imagemBase64 = reader.result;
                // 3. Salvar o anúncio no localStorage
                salvarAnuncio(novoAnuncio);
            };
            
            reader.readAsDataURL(fotoFile);
        } else {
            // Caso não haja foto
            salvarAnuncio(novoAnuncio);
        }
    });

    function salvarAnuncio(anuncio) {
        const anunciosExistentes = JSON.parse(localStorage.getItem('anuncios')) || [];
        anunciosExistentes.push(anuncio);
        localStorage.setItem('anuncios', JSON.stringify(anunciosExistentes));
        
        alert('Anúncio cadastrado com sucesso!');
        window.location.href = 'meus-itens.html'; // Redireciona para Meus Anúncios
    }
});

/**
 * Exclui um anúncio do localStorage com base no seu ID.
 * Esta função pode continuar aqui ou ser movida para um arquivo de utilitários se for usada em mais lugares.
 */
function excluirAnuncio(idDoAnuncio) {
    const confirmar = confirm('Tem certeza de que deseja excluir este anúncio? Esta ação não pode ser desfeita.');

    if (!confirmar) {
        return;
    }

    const anunciosExistentes = JSON.parse(localStorage.getItem('anuncios')) || [];
    const anunciosAtualizados = anunciosExistentes.filter(anuncio => anuncio.id !== idDoAnuncio);
    localStorage.setItem('anuncios', JSON.stringify(anunciosAtualizados));

    alert('Anúncio excluído com sucesso!');
    window.location.reload(); 
}