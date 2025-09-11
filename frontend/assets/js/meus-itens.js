document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const listaItensContainer = document.getElementById('meus-itens-lista');
    const inputBusca = document.getElementById('busca-nome');
    const selectCategoria = document.getElementById('filtro-categoria');
    const modal = document.getElementById('lances-modal');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalBody = document.getElementById('lances-modal-body');
    const btnFecharModal = document.getElementById('modal-fechar-btn');

    // --- CARREGAR DADOS ---
    // Usamos 'let' para que possamos modificar o array de lances ao cancelar uma oferta
    let todosAnuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
    let todosLances = JSON.parse(localStorage.getItem('lances')) || [];
    
    // Variável para guardar o ID do item que está com o modal aberto
    let currentItemId = null;

    // --- FUNÇÕES AUXILIARES ---
    
    // Função para calcular o valor efetivo de um lance (para ordenação)
    function getValorEfetivo(lance) {
        if (!lance) return -Infinity;
        switch (lance.tipo) {
            case 'pagar': return parseFloat(lance.valor);
            case 'gratis': return 0;
            case 'cobrar': return -parseFloat(lance.valor);
            default: return -Infinity;
        }
    }
    
    // --- FUNÇÕES PRINCIPAIS ---

    /**
     * Renderiza a lista de itens na tela com base em um array filtrado.
     * @param {Array} anunciosParaRenderizar O array de anúncios a ser exibido.
     */
    function renderizarItens(anunciosParaRenderizar) {
        listaItensContainer.innerHTML = ''; // Limpa a lista atual

        if (anunciosParaRenderizar.length === 0) {
            listaItensContainer.innerHTML = `<p class="empty-message">Nenhum item encontrado com os filtros selecionados.</p>`;
            return;
        }

        anunciosParaRenderizar.forEach(item => {
            const lancesDoItem = todosLances.filter(lance => lance.itemId === item.id);
            lancesDoItem.sort((a, b) => getValorEfetivo(b) - getValorEfetivo(a));
            const melhorLance = lancesDoItem[0];
            
            let melhorLanceTexto = 'Nenhuma oferta';
            if(melhorLance){
                 const valorFormatado = parseFloat(melhorLance.valor).toFixed(2).replace('.',',');
                 switch(melhorLance.tipo){
                     case 'pagar': melhorLanceTexto = `R$ ${valorFormatado}`; break;
                     case 'gratis': melhorLanceTexto = 'Retirada grátis'; break;
                     case 'cobrar': melhorLanceTexto = `Cobrando R$ ${valorFormatado}`; break;
                 }
            }

            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            itemCard.innerHTML = `
                <img src="${item.imagemBase64 || 'https://via.placeholder.com/300x200'}" alt="${item.titulo}" class="item-card-imagem">
                <div class="item-card-conteudo">
                    <h3>${item.titulo}</h3>
                    <div class="item-card-info">
                        <span><strong>Categoria:</strong> ${item.categoria}</span>
                        <span><strong>Valor Inicial:</strong> R$ ${parseFloat(item.valor).toFixed(2).replace('.',',')}</span>
                        <span><strong>Melhor Oferta:</strong> ${melhorLanceTexto}</span>
                    </div>
                    <div class="item-card-botoes">
                        <a href="editar-item.html?id=${item.id}" class="btn btn-editar">Editar</a>
                        <button class="btn btn-ver-lances" data-item-id="${item.id}">Ver Lances (${lancesDoItem.length})</button>
                    </div>
                </div>
            `;
            listaItensContainer.appendChild(itemCard);
        });
    }

    /**
     * Filtra os anúncios com base nos inputs de busca e categoria e os renderiza.
     */
    function aplicarFiltros() {
        const termoBusca = inputBusca.value.toLowerCase();
        const categoriaSelecionada = selectCategoria.value;

        const itensFiltrados = todosAnuncios.filter(item => {
            const correspondeNome = item.titulo.toLowerCase().includes(termoBusca);
            const correspondeCategoria = !categoriaSelecionada || item.categoria === categoriaSelecionada;
            return correspondeNome && correspondeCategoria;
        });

        renderizarItens(itensFiltrados);
    }

    /**
     * Abre o modal e exibe os lances para um item específico.
     * @param {string} itemId O ID do item cujos lances serão exibidos.
     */
    function abrirModalLances(itemId) {
        // Guarda o ID do item atual para ser usado por outras funções
        currentItemId = itemId;

        const item = todosAnuncios.find(anuncio => anuncio.id === itemId);
        if (!item) return;

        modalTitulo.textContent = `Lances para "${item.titulo}"`;
        
        const lancesDoItem = todosLances
            .filter(lance => lance.itemId === itemId)
            .sort((a, b) => getValorEfetivo(b) - getValorEfetivo(a));
        
        if (lancesDoItem.length === 0) {
            modalBody.innerHTML = '<p>Este item ainda não recebeu nenhuma oferta.</p>';
        } else {
            let lancesHTML = '<ul id="lances-lista">';
            lancesDoItem.forEach(lance => {
                const valorFormatado = parseFloat(lance.valor).toFixed(2).replace('.',',');
                let textoLance = '';
                switch(lance.tipo){
                     case 'pagar': textoLance = `Ofereceu pagar <strong>R$ ${valorFormatado}</strong>`; break;
                     case 'gratis': textoLance = 'Ofereceu retirar <strong>gratuitamente</strong>'; break;
                     case 'cobrar': textoLance = `Cobrou uma taxa de <strong>R$ ${valorFormatado}</strong> para retirar`; break;
                }

                // Adicionamos um <div> e o botão de cancelar com o ID do lance
                lancesHTML += `
                    <li>
                        <div>
                            ${textoLance}
                            <br><small>(${new Date(lance.data).toLocaleString('pt-BR')})</small>
                        </div>
                        <button class="btn-cancelar-lance" data-lance-id="${lance.id}" title="Cancelar esta oferta">Cancelar</button>
                    </li>`;
            });
            lancesHTML += '</ul>';
            modalBody.innerHTML = lancesHTML;
        }

        modal.style.display = 'flex';
    }

    /**
     * Fecha o modal de lances.
     */
    function fecharModal() {
        modal.style.display = 'none';
        currentItemId = null; // Limpa o ID do item atual ao fechar
    }

    /**
     * Cancela (remove) um lance específico.
     * @param {string} lanceId O ID do lance a ser cancelado.
     */
    function cancelarLance(lanceId) {
        if (!confirm('Tem certeza de que deseja cancelar esta oferta? Esta ação não pode ser desfeita.')) {
            return;
        }

        // Remove o lance do array 'todosLances'
        todosLances = todosLances.filter(lance => lance.id !== lanceId);
        
        // Atualiza o localStorage com o novo array de lances
        localStorage.setItem('lances', JSON.stringify(todosLances));

        // Atualiza a tela para refletir a remoção
        alert('Oferta cancelada com sucesso!');
        aplicarFiltros(); // Re-renderiza a lista de itens principal (atualiza contagem e melhor oferta)
        abrirModalLances(currentItemId); // Re-renderiza o modal com a lista de lances atualizada
    }

    // --- EVENT LISTENERS ---

    // Listeners para os filtros
    inputBusca.addEventListener('input', aplicarFiltros);
    selectCategoria.addEventListener('change', aplicarFiltros);

    // Listener para fechar o modal
    btnFecharModal.addEventListener('click', fecharModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) { // Fecha se clicar fora do conteúdo
            fecharModal();
        }
    });

    // Listener para os botões "Ver Lances" (usando delegação de eventos)
    listaItensContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-ver-lances')) {
            const itemId = event.target.dataset.itemId;
            abrirModalLances(itemId);
        }
    });

    // Listener para os botões "Cancelar" dentro do modal (usando delegação de eventos)
    modalBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-cancelar-lance')) {
            const lanceId = event.target.dataset.lanceId;
            cancelarLance(lanceId);
        }
    });

    // --- INICIALIZAÇÃO ---
    if (todosAnuncios.length === 0) {
        listaItensContainer.innerHTML = '<p class="empty-message">Você ainda não cadastrou nenhum item. <a href="cadastrar-novo-item.html">Clique aqui para começar!</a></p>';
    } else {
        aplicarFiltros(); // Renderiza todos os itens inicialmente
    }
});