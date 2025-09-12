// ../assets/js/home.js

document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM
    const itemsContainer = document.getElementById('items-container');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    // --- NOVAS REFERÊNCIAS ---
    const bairroFilter = document.getElementById('bairroFilter');
    const cidadeFilter = document.getElementById('cidadeFilter');
    const estadoFilter = document.getElementById('estadoFilter');

    // Carrega todos os anúncios do localStorage
    const todosAnuncios = JSON.parse(localStorage.getItem('anuncios')) || [];

    // --- Lógica para popular o filtro de categorias ---
    const popularCategorias = () => {
        const categorias = [...new Set(todosAnuncios.map(anuncio => anuncio.categoria).filter(Boolean))];
        categorias.sort();
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            categoryFilter.appendChild(option);
        });
    };

    // --- Função para renderizar os itens na tela ---
    const renderItems = (anunciosParaRenderizar) => {
        itemsContainer.innerHTML = '';

        const anunciosValidos = anunciosParaRenderizar.filter(anuncio => {
            if (!anuncio.dataCadastro || !anuncio.expiracaoDias) return true; // Mantém itens sem data para não sumirem
            const dataCadastro = new Date(anuncio.dataCadastro);
            const dataExpiracao = new Date(dataCadastro);
            dataExpiracao.setDate(dataCadastro.getDate() + parseInt(anuncio.expiracaoDias, 10));
            return new Date() <= dataExpiracao;
        });

        if (anunciosValidos.length === 0) {
            itemsContainer.innerHTML = '<p class="lead text-center">Nenhum item encontrado com os critérios de busca.</p>';
            return;
        }

        anunciosValidos.forEach(anuncio => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            itemCard.dataset.categoria = anuncio.categoria;

            const imagemSrc = anuncio.imagemBase64 || 'https://via.placeholder.com/300x200.png?text=Sem+Imagem';
            const lances = JSON.parse(localStorage.getItem('lances')) || [];
            const lancesDoItem = lances.filter(lance => lance.itemId === anuncio.id);
            const lanceAtual = lancesDoItem.length > 0
                ? Math.max(...lancesDoItem.map(l => l.valor))
                : anuncio.valor;
            const numLances = lancesDoItem.length;
            
            // --- INFORMAÇÃO DE LOCALIDADE ADICIONADA AO CARD ---
            const localidadeTexto = (anuncio.itemCidade && anuncio.itemEstado)
                ? `${anuncio.itemCidade}, ${anuncio.itemEstado}`
                : 'Localidade não informada';

            itemCard.innerHTML = `
                <img src="${imagemSrc}" alt="${anuncio.titulo}">
                <div class="item-info">
                    <h3>${anuncio.titulo}</h3>
                    <p class="item-location">📍 ${localidadeTexto}</p> 
                    <p class="item-description">${(anuncio.detalhes || '').substring(0, 80)}...</p>
                    <div class="bidding-info">
                        <span class="current-bid">Lance Atual: R$ ${parseFloat(lanceAtual).toFixed(2)}</span>
                        <span class="bid-count">${numLances} ${numLances === 1 ? 'lance' : 'lances'}</span>
                    </div>
                    <a href="detalhes-item.html?id=${anuncio.id}" class="btn-bid">Dar um Lance</a>
                </div>
            `;
            itemsContainer.appendChild(itemCard);
        });
    };

    // --- Função principal para filtrar e renderizar (ATUALIZADA) ---
    const filterAndRender = () => {
        // Pega os valores de todos os filtros
        const termoBusca = searchInput.value.toLowerCase().trim();
        const categoriaSelecionada = categoryFilter.value;
        const bairroBusca = bairroFilter.value.toLowerCase().trim();
        const cidadeBusca = cidadeFilter.value.toLowerCase().trim();
        const estadoSelecionado = estadoFilter.value;

        // Filtra o array de anúncios com base em todas as condições
        const anunciosFiltrados = todosAnuncios.filter(anuncio => {
            const correspondeNome = !termoBusca || anuncio.titulo.toLowerCase().includes(termoBusca);
            const correspondeCategoria = !categoriaSelecionada || anuncio.categoria === categoriaSelecionada;
            
            // Condições de localidade (com verificação para dados antigos)
            const correspondeBairro = !bairroBusca || (anuncio.itemBairro && anuncio.itemBairro.toLowerCase().includes(bairroBusca));
            const correspondeCidade = !cidadeBusca || (anuncio.itemCidade && anuncio.itemCidade.toLowerCase().includes(cidadeBusca));
            const correspondeEstado = !estadoSelecionado || (anuncio.itemEstado && anuncio.itemEstado === estadoSelecionado);

            return correspondeNome && correspondeCategoria && correspondeBairro && correspondeCidade && correspondeEstado;
        });

        renderItems(anunciosFiltrados);
    };

    // --- Configuração Inicial ---
    popularCategorias();
    renderItems(todosAnuncios);

    // Adiciona os "escutadores" de eventos para acionar a filtragem
    searchInput.addEventListener('input', filterAndRender);
    categoryFilter.addEventListener('change', filterAndRender);
    // --- NOVOS "ESCUTADORES" ---
    bairroFilter.addEventListener('input', filterAndRender);
    cidadeFilter.addEventListener('input', filterAndRender);
    estadoFilter.addEventListener('change', filterAndRender);
});