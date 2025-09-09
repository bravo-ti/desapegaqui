// ../assets/js/home.js

document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM
    const itemsContainer = document.getElementById('items-container');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    // Carrega todos os anúncios do localStorage
    const todosAnuncios = JSON.parse(localStorage.getItem('anuncios')) || [];

    // --- Lógica para popular o filtro de categorias ---
    const popularCategorias = () => {
        // Extrai categorias únicas dos anúncios, evitando duplicatas
        const categorias = [...new Set(todosAnuncios.map(anuncio => anuncio.categoria).filter(Boolean))];
        
        categorias.sort(); // Ordena as categorias em ordem alfabética

        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            categoryFilter.appendChild(option);
        });
    };

    // --- Função para renderizar os itens na tela ---
    const renderItems = (anunciosParaRenderizar) => {
        itemsContainer.innerHTML = ''; // Limpa a visualização atual

        // Filtra apenas os anúncios que não expiraram
        const anunciosValidos = anunciosParaRenderizar.filter(anuncio => {
            const dataCadastro = new Date(anuncio.dataCadastro);
            const dataExpiracao = new Date(dataCadastro);
            dataExpiracao.setDate(dataCadastro.getDate() + anuncio.expiracaoDias);
            return new Date() <= dataExpiracao;
        });

        if (anunciosValidos.length === 0) {
            itemsContainer.innerHTML = '<p class="lead text-center">Nenhum item encontrado com os critérios de busca.</p>';
            return;
        }

        anunciosValidos.forEach(anuncio => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            itemCard.dataset.categoria = anuncio.categoria; // Adiciona a categoria ao card

            const imagemSrc = anuncio.imagemBase64 || 'https://via.placeholder.com/300x200.png?text=Sem+Imagem';
            const lances = JSON.parse(localStorage.getItem('lances')) || [];
            const lancesDoItem = lances.filter(lance => lance.itemId === anuncio.id);
            const lanceAtual = lancesDoItem.length > 0
                ? Math.max(...lancesDoItem.map(l => l.valor))
                : anuncio.valor;
            const numLances = lancesDoItem.length;

            itemCard.innerHTML = `
                <img src="${imagemSrc}" alt="${anuncio.titulo}">
                <div class="item-info">
                    <h3>${anuncio.titulo}</h3>
                    <p class="item-description">${anuncio.detalhes.substring(0, 100)}...</p>
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

    // --- Função principal para filtrar e renderizar ---
    const filterAndRender = () => {
        const termoBusca = searchInput.value.toLowerCase();
        const categoriaSelecionada = categoryFilter.value;

        let anunciosFiltrados = todosAnuncios;

        // 1. Filtra por nome (termo de busca)
        if (termoBusca) {
            anunciosFiltrados = anunciosFiltrados.filter(anuncio =>
                anuncio.titulo.toLowerCase().includes(termoBusca)
            );
        }

        // 2. Filtra por categoria
        if (categoriaSelecionada) {
            anunciosFiltrados = anunciosFiltrados.filter(anuncio =>
                anuncio.categoria === categoriaSelecionada
            );
        }

        renderItems(anunciosFiltrados);
    };

    // --- Configuração Inicial ---
    popularCategorias(); // Popula o dropdown de categorias
    renderItems(todosAnuncios); // Renderiza todos os itens na primeira vez que a página carrega

    // Adiciona os "escutadores" de eventos para acionar a filtragem
    searchInput.addEventListener('input', filterAndRender);
    categoryFilter.addEventListener('change', filterAndRender);
});