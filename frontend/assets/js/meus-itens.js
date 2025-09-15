document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const listaItensContainer = document.getElementById('items-grid-container');
    const inputBusca = document.getElementById('busca-nome');
    const selectCategoria = document.getElementById('filtro-categoria');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalBody = document.getElementById('lances-modal-body');
    const btnFecharModal = document.getElementById('modal-fechar-btn');
    // ATUALIZADO: Removidos filtros de bairro/cidade/estado e adicionado filtro único de localização
    const inputLocalizacao = document.getElementById('filtro-localizacao'); 
    const modal = document.getElementById('lances-modal');

    // --- CARREGAR DADOS ---
    let todosAnuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
    let todosLances = JSON.parse(localStorage.getItem('lances')) || [];
    let currentItemId = null;

    // --- FUNÇÕES AUXILIARES ---
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
     * ATUALIZADO: Função adicionada para excluir anúncios.
     */
    function excluirAnuncio(idDoAnuncio) {
        if (!confirm('Tem certeza de que deseja excluir este anúncio?')) {
            return;
        }
        todosAnuncios = todosAnuncios.filter(anuncio => anuncio.id !== idDoAnuncio);
        localStorage.setItem('anuncios', JSON.stringify(todosAnuncios));
        alert('Anúncio excluído com sucesso!');
        aplicarFiltros(); // Re-renderiza a lista
    }

    function renderizarItens(anunciosParaRenderizar) {
        listaItensContainer.innerHTML = '';

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

            // ATUALIZADO: Propriedades 'imagemBase64', 'titulo' e 'valor' trocadas para 'foto', 'titulo', e 'valor'
            // Nota: O seu `cadastro.js` usa 'titulo' e 'valor', que correspondem a 'nome' e 'preco' do formulário. Mantivemos a consistência.
            const valorInicial = parseFloat(item.valor).toFixed(2).replace('.',',');

            itemCard.innerHTML = `
                <img src="${item.imagemBase64 || 'https://via.placeholder.com/300x200'}" alt="${item.titulo}" class="item-card-imagem">
                <div class="item-card-conteudo">
                    <h3>${item.titulo}</h3>
                    <div class="item-card-info">
                        <span><strong>Categoria:</strong> ${item.categoria}</span>
                        <span><strong>Valor Inicial:</strong> R$ ${valorInicial}</span>
                        <span><strong>Melhor Oferta:</strong> ${melhorLanceTexto}</span>
                    </div>
                    <div class="item-card-botoes">
                        <button class="btn btn-excluir" data-id="${item.id}">Excluir Anúncio</button>
                        <button class="btn btn-ver-lances" data-item-id="${item.id}">Ver Lances (${lancesDoItem.length})</button>
                    </div>
                </div>
            `;
            listaItensContainer.appendChild(itemCard);
        });
    }

    function aplicarFiltros() {
        const termoBusca = inputBusca.value.toLowerCase().trim();
        const categoriaSelecionada = selectCategoria.value;
        // ATUALIZADO: Filtro de localização simplificado
        const localizacaoBusca = inputLocalizacao ? inputLocalizacao.value.toLowerCase().trim() : '';

        const itensFiltrados = todosAnuncios.filter(item => {
            // ATUALIZADO: Filtra por 'titulo' (que corresponde ao campo 'nome' do form)
            const correspondeNome = item.titulo.toLowerCase().includes(termoBusca);
            const correspondeCategoria = !categoriaSelecionada || item.categoria === categoriaSelecionada;
            
            // ATUALIZADO: Filtro de localização agora busca no campo único 'localizacao'
            const correspondeLocalizacao = !localizacaoBusca || (item.localizacao && item.localizacao.toLowerCase().includes(localizacaoBusca));
            
            return correspondeNome && correspondeCategoria && correspondeLocalizacao;
        });

        renderizarItens(itensFiltrados);
    }

    function abrirModalLances(itemId) {
        currentItemId = itemId;
        const item = todosAnuncios.find(anuncio => anuncio.id === itemId);
        if (!item) return;

        // ATUALIZADO: usa 'item.titulo'
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

    function fecharModal() {
        modal.style.display = 'none';
        currentItemId = null;
    }

    function cancelarLance(lanceId) {
        if (!confirm('Tem certeza de que deseja cancelar esta oferta?')) {
            return;
        }
        todosLances = todosLances.filter(lance => lance.id !== lanceId);
        localStorage.setItem('lances', JSON.stringify(todosLances));
        alert('Oferta cancelada com sucesso!');
        aplicarFiltros();
        abrirModalLances(currentItemId);
    }

    // --- EVENT LISTENERS ---
    inputBusca.addEventListener('input', aplicarFiltros);
    selectCategoria.addEventListener('change', aplicarFiltros);
    // ATUALIZADO: Listener para o novo filtro de localização
    if (inputLocalizacao) {
        inputLocalizacao.addEventListener('input', aplicarFiltros);
    }

    btnFecharModal.addEventListener('click', fecharModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            fecharModal();
        }
    });

    listaItensContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-ver-lances')) {
            const itemId = event.target.dataset.itemId;
            abrirModalLances(itemId);
        } else if (event.target.classList.contains('btn-excluir')) {
            const itemId = event.target.dataset.id;
            excluirAnuncio(itemId); // Chama a função de exclusão
        }
    });

    modalBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-cancelar-lance')) {
            const lanceId = event.target.dataset.lanceId;
            cancelarLance(lanceId);
        }
    });

    // --- INICIALIZAÇÃO ---
    if (todosAnuncios.length === 0) {
        listaItensContainer.innerHTML = '<p class="empty-message">Você ainda não cadastrou nenhum item. <a href="cadastrar-item.html">Clique aqui para começar!</a></p>';
    } else {
        aplicarFiltros();
    }
});