document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o formulário pelo ID para ser mais específico
    const itemForm = document.getElementById('item-form');
    
    // Se o formulário não existir na página, interrompe o script
    if (!itemForm) {
        return;
    }

    itemForm.addEventListener('submit', (event) => {
        // Previne o comportamento padrão do formulário (que seria recarregar a página)
        event.preventDefault();

        // 1. Coletar os dados do formulário
        const formData = new FormData(itemForm);

        const novoAnuncio = {
            id: 'anuncio-' + Date.now(), // Cria um ID único baseado no tempo
            titulo: formData.get('itemTitulo'),
            detalhes: formData.get('itemDetalhes'),
            valor: parseFloat(formData.get('itemValor')).toFixed(2),
            categoria: formData.get('itemCategoria'),
            expiracaoDias: parseInt(formData.get('itemExpiracao')),
            dataCadastro: new Date().toISOString()
        };

        // 2. Processar a imagem
        const fotoInput = document.getElementById('item-foto');
        const fotoFile = fotoInput.files[0];

        if (fotoFile) {
            const reader = new FileReader();

            // Quando a leitura do arquivo terminar
            reader.onloadend = () => {
                // A imagem é convertida para Base64, um formato de texto
                // que pode ser salvo no localStorage.
                novoAnuncio.imagemBase64 = reader.result;
                
                // 3. Salvar o anúncio no localStorage
                salvarAnuncio(novoAnuncio);
            };

            // Inicia a leitura do arquivo de imagem
            reader.readAsDataURL(fotoFile);
        } else {
            // Caso não haja foto (embora o campo seja 'required', é uma boa prática ter um fallback)
            salvarAnuncio(novoAnuncio);
        }
    });

    function salvarAnuncio(anuncio) {
        // Busca os anúncios já existentes no localStorage. Se não houver, começa com um array vazio.
        const anunciosExistentes = JSON.parse(localStorage.getItem('anuncios')) || [];

        // Adiciona o novo anúncio à lista
        anunciosExistentes.push(anuncio);

        // Salva a lista atualizada de volta no localStorage
        // JSON.stringify converte o array de objetos em uma string, que é como o localStorage armazena dados.
        localStorage.setItem('anuncios', JSON.stringify(anunciosExistentes));

        // 4. Avisar o usuário e redirecionar
        alert('Anúncio cadastrado com sucesso!');
        window.location.href = 'itens-disponiveis.html'; // Redireciona para a página inicial
    }
});

/**
 * Exclui um anúncio do localStorage com base no seu ID.
 * @param {string} idDoAnuncio - O ID do anúncio a ser excluído.
 */
function excluirAnuncio(idDoAnuncio) {
    // Pede uma confirmação ao usuário antes de prosseguir.
    const confirmar = confirm('Tem certeza de que deseja excluir este anúncio? Esta ação não pode ser desfeita.');

    // Se o usuário não confirmar, a função para aqui.
    if (!confirmar) {
        return;
    }

    // Busca os anúncios existentes no localStorage.
    const anunciosExistentes = JSON.parse(localStorage.getItem('anuncios')) || [];

    // Cria uma nova lista contendo apenas os anúncios cujo ID é DIFERENTE daquele que queremos excluir.
    // O método 'filter' é perfeito para isso.
    const anunciosAtualizados = anunciosExistentes.filter(anuncio => anuncio.id !== idDoAnuncio);

    // Salva a nova lista (sem o item excluído) de volta no localStorage.
    localStorage.setItem('anuncios', JSON.stringify(anunciosAtualizados));

    // Avisa o usuário e recarrega a página para que a lista seja atualizada visualmente.
    alert('Anúncio excluído com sucesso!');
    window.location.reload(); // Recarrega a página para refletir a exclusão.
}