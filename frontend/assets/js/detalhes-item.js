document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    // Elementos da sua lógica original
    const itemDetalheContainer = document.getElementById('item-detalhe-container');
    const lancesHistoricoContainer = document.getElementById('lances-historico-container');
    const formLance = document.getElementById('form-lance');
    
    // Elementos adicionados para as 3 opções de lance
    const tipoLanceRadios = document.querySelectorAll('input[name="tipoLance"]');
    const valorLanceContainer = document.getElementById('valor-lance-container');
    const valorLanceInput = document.getElementById('valor-lance');
    const valorLanceLabel = document.getElementById('valor-lance-label');

    // --- 1. PEGAR O ID DO ITEM DA URL E CARREGAR DADOS ---
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('id');

    if (!itemId) {
        itemDetalheContainer.innerHTML = '<p class="lead text-center">Item não encontrado. Volte para a página inicial.</p>';
        formLance.style.display = 'none'; // Esconde o formulário se não houver item
        return;
    }

    const todosAnuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
    const todosLances = JSON.parse(localStorage.getItem('lances')) || [];
    const item = todosAnuncios.find(anuncio => anuncio.id === itemId);

    if (!item) {
        itemDetalheContainer.innerHTML = '<p class="lead text-center">Item não encontrado. Volte para a página inicial.</p>';
        formLance.style.display = 'none';
        return;
    }
    
    // --- 2. LÓGICA DE LANCES ATUALIZADA ---

    // Função auxiliar para determinar o "valor efetivo" de um lance para ordenação
    // Pagar é positivo, grátis é zero, cobrar é negativo.
    function getValorEfetivo(lance) {
        switch (lance.tipo) {
            case 'pagar':
                return parseFloat(lance.valor);
            case 'gratis':
                return 0;
            case 'cobrar':
                return -parseFloat(lance.valor);
            default:
                return -Infinity; // Lances desconhecidos vão para o fim
        }
    }

    // Filtra lances para este item e ordena pela melhor oferta para o dono do item
    const lancesDoItem = todosLances
        .filter(lance => lance.itemId === itemId)
        .sort((a, b) => getValorEfetivo(b) - getValorEfetivo(a)); // O maior valor efetivo primeiro

    // --- 3. FUNÇÕES PARA RENDERIZAR O CONTEÚDO ---

    /**
     * Atualiza a UI do formulário (mostra/esconde campo de valor)
     */
    function atualizarFormularioUI() {
        const selectedType = document.querySelector('input[name="tipoLance"]:checked').value;

        if (selectedType === 'gratis') {
            valorLanceContainer.style.display = 'none';
            valorLanceInput.required = false;
        } else {
            valorLanceContainer.style.display = 'block';
            valorLanceInput.required = true;
            valorLanceLabel.textContent = selectedType === 'pagar' 
                ? 'Valor a pagar (R$)' 
                : 'Valor a cobrar pela retirada (R$)';
            valorLanceInput.placeholder = selectedType === 'pagar' ? 'Ex: 50.00' : 'Ex: 25.00';
        }
    }

    // ATUALIZE APENAS ESTA FUNÇÃO NO SEU ARQUIVO detalhes-item.js

    /**
     * Renderiza os detalhes do item, o valor inicial e a melhor oferta atual
     */
    function renderizarDetalhesItem() {
        const imagemSrc = item.imagemBase64 || 'https://via.placeholder.com/600x400.png?text=Sem+Imagem';
        
        // --- NOVO --- Formata o valor inicial definido pelo anunciante
        const valorInicialAnunciante = parseFloat(item.valor || 0).toFixed(2).replace('.',',');

        // Determina qual é a melhor oferta atual
        let melhorOfertaHTML = '<span>Nenhuma oferta ainda</span>';
        const melhorLance = lancesDoItem[0]; // O primeiro item após a ordenação é o melhor

        if (melhorLance) {
            const valorFormatado = parseFloat(melhorLance.valor).toFixed(2).replace('.',',');
            switch (melhorLance.tipo) {
                case 'pagar':
                    melhorOfertaHTML = `<span>Oferta Atual</span> <strong class="valor-lance-atual">R$ ${valorFormatado}</strong>`;
                    break;
                case 'gratis':
                    melhorOfertaHTML = `<span>Oferta Atual</span> <strong class="valor-lance-atual">Retirada Gratuita</strong>`;
                    break;
                case 'cobrar':
                     melhorOfertaHTML = `<span>Oferta Atual</span> <strong class="valor-lance-atual">Cobrando R$ ${valorFormatado}</strong>`;
                    break;
            }
        }

        itemDetalheContainer.innerHTML = `
            <div class="item-imagem-grande">
                <img src="${imagemSrc}" alt="${item.titulo}">
            </div>
            <div class="item-info-detalhe">
                <h1>${item.titulo}</h1>
                <p class="item-description-detalhe">${item.detalhes}</p>
                <div class="categoria-tag">Categoria: ${item.categoria}</div>

                <div class="valor-inicial-box">
                    <span>Valor do Anunciante</span>
                    <strong class="valor-anunciado">R$ ${valorInicialAnunciante}</strong>
                </div>
                <div class="lance-atual-box">
                    ${melhorOfertaHTML}
                </div>
            </div>
        `;
    }
    /**
     * Renderiza o histórico com os diferentes tipos de lances
     */
    function renderizarHistoricoLances() {
        if (lancesDoItem.length === 0) {
            lancesHistoricoContainer.innerHTML = '<p>Nenhuma oferta foi feita ainda. Seja o primeiro!</p>';
            return;
        }
        
        const lancesHTML = lancesDoItem.map(lance => {
            const valorFormatado = parseFloat(lance.valor).toFixed(2).replace('.',',');
            const dataFormatada = new Date(lance.data).toLocaleString('pt-BR');
            let textoLance = '';

            switch (lance.tipo) {
                case 'pagar':
                    textoLance = `Ofereceu pagar <strong>R$ ${valorFormatado}</strong>`;
                    break;
                case 'gratis':
                    textoLance = `Ofereceu retirar <strong>gratuitamente</strong>`;
                    break;
                case 'cobrar':
                    textoLance = `Cobrou uma taxa de <strong>R$ ${valorFormatado}</strong> para retirar`;
                    break;
            }

            return `<li>${textoLance} <span>em ${dataFormatada}</span></li>`;
        }).join('');

        lancesHistoricoContainer.innerHTML = `<ul class="lista-lances">${lancesHTML}</ul>`;
    }

    // --- 4. LÓGICA DO FORMULÁRIO DE LANCE (ATUALIZADA) ---
    formLance.addEventListener('submit', (event) => {
        event.preventDefault();

        const tipoSelecionado = document.querySelector('input[name="tipoLance"]:checked').value;
        const valorNumerico = parseFloat(valorLanceInput.value) || 0;

        // Validação
        if (tipoSelecionado !== 'gratis' && valorNumerico <= 0) {
            alert('Para esta opção, por favor, insira um valor válido e maior que zero.');
            return;
        }

        // Criar o novo objeto de lance com o tipo
        const novoLance = {
            id: 'lance-' + Date.now(),
            itemId: itemId,
            tipo: tipoSelecionado,
            valor: valorNumerico,
            data: new Date().toISOString()
            // Futuramente, adicione o ID do usuário: userId: '...'
        };

        // Salvar no localStorage
        todosLances.push(novoLance);
        localStorage.setItem('lances', JSON.stringify(todosLances));

        alert('Sua oferta foi registrada com sucesso!');
        window.location.reload(); // Recarrega para exibir as atualizações
    });


    // --- 5. CHAMADAS INICIAIS ---
    renderizarDetalhesItem();
    renderizarHistoricoLances();
    atualizarFormularioUI(); // Garante que o formulário comece no estado correto
    
    // Adiciona o listener para os botões de rádio mudarem a UI
    tipoLanceRadios.forEach(radio => {
        radio.addEventListener('change', atualizarFormularioUI);
    });
});