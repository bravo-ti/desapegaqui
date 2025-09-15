document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const itemDetalheContainer = document.getElementById('item-detalhe-container');
    const lancesHistoricoContainer = document.getElementById('lances-historico-container');
    const formLance = document.getElementById('form-lance');
    const tipoLanceRadios = document.querySelectorAll('input[name="tipoLance"]');
    const valorLanceContainer = document.getElementById('valor-lance-container');
    const valorLanceInput = document.getElementById('valor-lance');
    const valorLanceLabel = document.getElementById('valor-lance-label');

    // --- 1. PEGAR O ID DO ITEM E CARREGAR DADOS ---
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('id');

    if (!itemId) {
        itemDetalheContainer.innerHTML = '<p class="lead text-center">Item não encontrado.</p>';
        if (formLance) formLance.style.display = 'none';
        return;
    }

    // --- 2. FUNÇÕES AUXILIARES ---
    function verificarPrazos() {
        let todosAnuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
        const agora = new Date();
        let houveMudanca = false;
        todosAnuncios.forEach(anuncio => {
            if (anuncio.status === 'ativo') {
                const dataCadastro = new Date(anuncio.dataCadastro);
                const diasExpiracao = parseInt(anuncio.expiracaoDias);
                const dataExpiracao = new Date(dataCadastro);
                dataExpiracao.setDate(dataCadastro.getDate() + diasExpiracao);
                if (agora > dataExpiracao) {
                    anuncio.status = 'expirado';
                    houveMudanca = true;
                }
            }
        });
        if (houveMudanca) {
            localStorage.setItem('anuncios', JSON.stringify(todosAnuncios));
        }
    }

    function getValorEfetivo(lance) {
        switch (lance.tipo) {
            case 'pagar': return parseFloat(lance.valor);
            case 'gratis': return 0;
            case 'cobrar': return -parseFloat(lance.valor);
            default: return -Infinity;
        }
    }

    function atualizarFormularioUI() {
        if (!formLance || formLance.style.display === 'none') return;
        const tipoSelecionado = document.querySelector('input[name="tipoLance"]:checked').value;
        if (tipoSelecionado === 'gratis') {
            valorLanceContainer.style.display = 'none';
            valorLanceInput.required = false;
        } else {
            valorLanceContainer.style.display = 'block';
            valorLanceInput.required = true;
            valorLanceLabel.textContent = tipoSelecionado === 'pagar' 
                ? 'Valor que você oferece para pagar (R$)' 
                : 'Valor que você quer cobrar pela retirada (R$)';
            valorLanceInput.placeholder = tipoSelecionado === 'pagar' ? 'Ex: 50.00' : 'Ex: 25.00';
        }
    }

    // --- CARREGAMENTO INICIAL DOS DADOS ---
    verificarPrazos();
    const todosAnuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
    const todosLances = JSON.parse(localStorage.getItem('lances')) || [];
    const item = todosAnuncios.find(anuncio => anuncio.id === itemId);

    if (!item) {
        itemDetalheContainer.innerHTML = '<p class="lead text-center">Item não encontrado ou inválido.</p>';
        if (formLance) formLance.style.display = 'none';
        return;
    }

    const lancesDoItem = todosLances
        .filter(lance => lance.itemId === itemId)
        .sort((a, b) => getValorEfetivo(b) - getValorEfetivo(a));
    
    // --- 3. FUNÇÕES DE RENDERIZAÇÃO ---

    // <-- CÓDIGO RESTAURADO: A lógica completa da função está de volta.
    function renderizarDetalhesItem() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const imagemSrc = item.imagemBase64 || 'https://via.placeholder.com/600x400.png?text=Sem+Imagem';
        let detalhesHTML = '';

        switch (item.status) {
            case 'ativo':
                if (formLance) formLance.style.display = 'block';
                const valorInicialAnunciante = parseFloat(item.valor || 0).toFixed(2).replace('.', ',');
                const melhorLance = lancesDoItem[0];
                let melhorOfertaHTML = '<span>Nenhuma oferta ainda</span>';

                if (melhorLance) {
                    const valorFormatado = parseFloat(melhorLance.valor).toFixed(2).replace('.', ',');
                    switch (melhorLance.tipo) {
                        case 'pagar': melhorOfertaHTML = `<span>Oferta Atual</span> <strong class="valor-lance-atual">R$ ${valorFormatado}</strong>`; break;
                        case 'gratis': melhorOfertaHTML = `<span>Oferta Atual</span> <strong class="valor-lance-atual">Retirada Gratuita</strong>`; break;
                        case 'cobrar': melhorOfertaHTML = `<span>Oferta Atual</span> <strong class="valor-lance-atual">Cobrando R$ ${valorFormatado}</strong>`; break;
                    }
                }

                detalhesHTML = `
                    <div class="item-imagem-grande"><img src="${imagemSrc}" alt="${item.titulo}"></div>
                    <div class="item-info-detalhe">
                        <h1>${item.titulo}</h1>
                        <p class="item-description-detalhe">${item.detalhes}</p>
                        <div class="categoria-tag">Categoria: ${item.categoria}</div>
                        <div class="valor-inicial-box">
                            <span>Valor do Anunciante</span>
                            <strong class="valor-anunciado">R$ ${valorInicialAnunciante}</strong>
                        </div>
                        <div class="lance-atual-box">${melhorOfertaHTML}</div>
                    </div>`;
                break;

            case 'expirado':
                if (formLance) formLance.style.display = 'none';
                const vencedor = lancesDoItem[0];
                let acordoHTML = '<p class="lead">Aguardando acordo entre as partes.</p>';

                if (vencedor && currentUser && (currentUser.id === item.ownerId || currentUser.id === vencedor.bidderId)) {
                    acordoHTML += `
                        <div class="item-card-botoes negociacao mt-3">
                            <button class="btn btn-success btn-aceitar" data-id="${item.id}">Aceitar Acordo</button>
                            <button class="btn btn-danger btn-recusar" data-id="${item.id}">Recusar Acordo</button>
                        </div>`;
                }
                
                detalhesHTML = `
                    <div class="status-header bg-warning text-dark">PRAZO ENCERRADO</div>
                    <div class="item-imagem-grande"><img src="${imagemSrc}" alt="${item.titulo}"></div>
                    <div class="item-info-detalhe">
                        <h1>${item.titulo}</h1>
                        <p class="item-description-detalhe">${item.detalhes}</p>
                        ${acordoHTML}
                    </div>`;
                break;

            // ... (Casos 'negociado' e 'cancelado' completos)
            case 'negociado':
                if (formLance) formLance.style.display = 'none';
                detalhesHTML = `
                    <div class="status-header bg-success text-white">NEGOCIADO</div>
                    <div class="item-imagem-grande"><img src="${imagemSrc}" alt="${item.titulo}" style="opacity:0.5;"></div>
                    <div class="item-info-detalhe">
                        <h1>${item.titulo}</h1>
                        <p class="lead">Este item foi negociado com sucesso!</p>
                    </div>`;
                break;

            case 'cancelado':
                if (formLance) formLance.style.display = 'none';
                detalhesHTML = `
                    <div class="status-header bg-danger text-white">NEGOCIAÇÃO CANCELADA</div>
                    <div class="item-imagem-grande"><img src="${imagemSrc}" alt="${item.titulo}" style="opacity:0.5;"></div>
                    <div class="item-info-detalhe">
                        <h1>${item.titulo}</h1>
                        <p class="lead">Não houve acordo para este item.</p>
                    </div>`;
                break;
        }
        itemDetalheContainer.innerHTML = detalhesHTML;
    }

    // <-- CÓDIGO RESTAURADO: A lógica completa da função está de volta.
    function renderizarHistoricoLances() {
        if (!lancesHistoricoContainer) return;
        if (lancesDoItem.length === 0) {
            lancesHistoricoContainer.innerHTML = '<p>Nenhuma oferta foi feita ainda. Seja o primeiro!</p>';
            return;
        }
        const lancesHTML = lancesDoItem.map(lance => {
            const valorFormatado = parseFloat(lance.valor).toFixed(2).replace(',', '.');
            const dataFormatada = new Date(lance.data).toLocaleString('pt-BR');
            let textoLance = '';
            const bidderName = `Usuário (ID: ${lance.bidderId})`;
            switch (lance.tipo) {
                case 'pagar': textoLance = `${bidderName} ofereceu pagar <strong>R$ ${valorFormatado}</strong>`; break;
                case 'gratis': textoLance = `${bidderName} ofereceu retirar <strong>gratuitamente</strong>`; break;
                case 'cobrar': textoLance = `${bidderName} cobrou uma taxa de <strong>R$ ${valorFormatado}</strong> para retirar`; break;
            }
            return `<li>${textoLance} <span class="data-lance">em ${dataFormatada}</span></li>`;
        }).join('');
        lancesHistoricoContainer.innerHTML = `<ul class="lista-lances">${lancesHTML}</ul>`;
    }

    // --- 4. LÓGICA DE ACORDO ---
    function gerenciarAcordo(itemId, decisao) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let todosAnuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
        let acordos = JSON.parse(localStorage.getItem('acordos')) || {};
        const item = todosAnuncios.find(i => i.id === itemId);
        if (!item) return;

        if (!acordos[itemId]) {
            acordos[itemId] = { ownerAgreed: null, bidderAgreed: null };
        }

        if (currentUser.id === item.ownerId) {
            acordos[itemId].ownerAgreed = decisao;
        } else {
            acordos[itemId].bidderAgreed = decisao;
        }

        if (acordos[itemId].ownerAgreed === false || acordos[itemId].bidderAgreed === false) {
            item.status = 'cancelado';
        } else if (acordos[itemId].ownerAgreed === true && acordos[itemId].bidderAgreed === true) {
            item.status = 'negociado';
        }

        localStorage.setItem('acordos', JSON.stringify(acordos));
        localStorage.setItem('anuncios', JSON.stringify(todosAnuncios));
        window.location.reload(); // Recarrega para ver o status final
    }

    // --- 5. EVENT LISTENERS ---
    if (formLance) {
        formLance.addEventListener('submit', (event) => {
            event.preventDefault();
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) { alert('Você precisa estar logado para fazer uma oferta.'); return; }
            if (currentUser.id === item.ownerId) { alert('Você não pode dar lances no seu próprio item.'); return; }

            const tipoSelecionado = document.querySelector('input[name="tipoLance"]:checked').value;
            const valorNumerico = parseFloat(valorLanceInput.value) || 0;
            
            if (tipoSelecionado !== 'gratis' && valorNumerico <= 0) {
                alert('Para esta opção, por favor, insira um valor válido e maior que zero.');
                return;
            }

            const novoLance = {
                id: 'lance-' + Date.now(),
                itemId: itemId,
                tipo: tipoSelecionado,
                valor: valorNumerico,
                data: new Date().toISOString(),
                bidderId: currentUser.id
            };
            todosLances.push(novoLance);
            localStorage.setItem('lances', JSON.stringify(todosLances));
            alert('Sua oferta foi registrada com sucesso!');
            window.location.reload();
        });
    }

    itemDetalheContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-aceitar')) { gerenciarAcordo(event.target.dataset.id, true); }
        if (event.target.classList.contains('btn-recusar')) { gerenciarAcordo(event.target.dataset.id, false); }
    });
    
    tipoLanceRadios.forEach(radio => {
        radio.addEventListener('change', atualizarFormularioUI);
    });

    // --- 6. CHAMADAS INICIAIS ---
    renderizarDetalhesItem();
    renderizarHistoricoLances();
    atualizarFormularioUI();
});