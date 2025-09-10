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
    const todosAnuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
    const todosLances = JSON.parse(localStorage.getItem('lances')) || [];
    
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
                lancesHTML += `<li>${textoLance} <br><small>(${new Date(lance.data).toLocaleString('pt-BR')})</small></li>`;
            });
            lancesHTML += '</ul>';
            modalBody.innerHTML = lancesHTML;
        }

        modal.style.display = 'flex';
    }

    function fecharModal() {
        modal.style.display = 'none';
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

    // --- INICIALIZAÇÃO ---
    if (todosAnuncios.length === 0) {
        listaItensContainer.innerHTML = '<p class="empty-message">Você ainda não cadastrou nenhum item. <a href="cadastrar-item.html">Clique aqui para começar!</a></p>';
    } else {
        aplicarFiltros(); // Renderiza todos os itens inicialmente
    }
});