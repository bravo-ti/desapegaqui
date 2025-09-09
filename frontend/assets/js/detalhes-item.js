document.addEventListener('DOMContentLoaded', () => {
    // ELEMENTOS DA PÁGINA
    const itemDetalheContainer = document.getElementById('item-detalhe-container');
    const lancesHistoricoContainer = document.getElementById('lances-historico-container');
    const formLance = document.getElementById('form-lance');
    const inputValorLance = document.getElementById('valor-lance');

    // 1. PEGAR O ID DO ITEM DA URL
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('id');

    if (!itemId) {
        itemDetalheContainer.innerHTML = '<p class="lead text-center">Item não encontrado. Volte para a página inicial.</p>';
        return;
    }

    // 2. CARREGAR DADOS DO LOCALSTORAGE
    const todosAnuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
    const todosLances = JSON.parse(localStorage.getItem('lances')) || [];

    const item = todosAnuncios.find(anuncio => anuncio.id === itemId);

    if (!item) {
        itemDetalheContainer.innerHTML = '<p class="lead text-center">Item não encontrado. Volte para a página inicial.</p>';
        return;
    }

    // Filtra lances apenas para este item e ordena do maior para o menor
    const lancesDoItem = todosLances
        .filter(lance => lance.itemId === itemId)
        .sort((a, b) => b.valor - a.valor);

    // 3. FUNÇÕES PARA RENDERIZAR O CONTEÚDO
    function renderizarDetalhesItem() {
        const maiorLanceObj = lancesDoItem[0];
        const maiorLanceValor = maiorLanceObj ? maiorLanceObj.valor : item.valor;

        const imagemSrc = item.imagemBase64 || 'https://via.placeholder.com/600x400.png?text=Sem+Imagem';

        itemDetalheContainer.innerHTML = `
            <div class="item-imagem-grande">
                <img src="${imagemSrc}" alt="${item.titulo}">
            </div>
            <div class="item-info-detalhe">
                <h1>${item.titulo}</h1>
                <p class="item-description-detalhe">${item.detalhes}</p>
                <div class="categoria-tag">Categoria: ${item.categoria}</div>
                <div class="lance-atual-box">
                    <span>Lance Atual</span>
                    <strong class="valor-lance-atual">R$ ${parseFloat(maiorLanceValor).toFixed(2)}</strong>
                </div>
            </div>
        `;
        
        // Atualiza o placeholder e o valor mínimo do input de lance
        inputValorLance.placeholder = `Maior que R$ ${parseFloat(maiorLanceValor).toFixed(2)}`;
        inputValorLance.min = (parseFloat(maiorLanceValor) + 0.01).toFixed(2);
    }

    function renderizarHistoricoLances() {
        if (lancesDoItem.length === 0) {
            lancesHistoricoContainer.innerHTML = '<p>Nenhum lance foi dado ainda. Seja o primeiro!</p>';
            return;
        }

        lancesHistoricoContainer.innerHTML = `
            <ul class="lista-lances">
                ${lancesDoItem.map(lance => `
                    <li>
                        <strong>R$ ${parseFloat(lance.valor).toFixed(2)}</strong>
                        <span>em ${new Date(lance.data).toLocaleString('pt-BR')}</span>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    // 4. LÓGICA DO FORMULÁRIO DE LANCE
    formLance.addEventListener('submit', (event) => {
        event.preventDefault();

        const novoValorLance = parseFloat(inputValorLance.value);
        const maiorLanceAtual = parseFloat(inputValorLance.min) - 0.01;

        // Validação
        if (novoValorLance <= maiorLanceAtual) {
            alert(`Seu lance deve ser maior que R$ ${maiorLanceAtual.toFixed(2)}.`);
            return;
        }

        // Criar o novo objeto de lance
        const novoLance = {
            id: 'lance-' + Date.now(),
            itemId: itemId,
            valor: novoValorLance,
            data: new Date().toISOString()
            // Futuramente, você pode adicionar o ID do usuário aqui:
            // userId: 'id-do-usuario-logado'
        };

        // Salvar no localStorage
        todosLances.push(novoLance);
        localStorage.setItem('lances', JSON.stringify(todosLances));

        // Feedback para o usuário e recarregar a página para ver as atualizações
        alert('Lance realizado com sucesso!');
        window.location.reload();
    });


    // 5. CHAMAR AS FUNÇÕES PARA MONTAR A PÁGINA
    renderizarDetalhesItem();
    renderizarHistoricoLances();
});