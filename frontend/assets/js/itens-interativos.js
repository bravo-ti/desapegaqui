document.addEventListener('DOMContentLoaded', () => {
  let itens = JSON.parse(localStorage.getItem('itens')) || [];
  const listaItens = document.getElementById('lista-itens');
  const filtroInput = document.getElementById('filtro');

  function renderizaInteresses(ul, interesses) {
    ul.innerHTML = '';
    interesses.forEach(i => {
      const li = document.createElement('li');
      li.textContent = i;
      ul.appendChild(li);
    });
  }

  function exibirItens(lista = itens) {
    listaItens.innerHTML = '';

    if (lista.length === 0) {
      listaItens.innerHTML = `<p class="text-center">Nenhum item cadastrado.</p>`;
      return;
    }

    lista.forEach((item, index) => {
      if (!item.interesses) item.interesses = [];

      const card = document.createElement('div');
      card.classList.add('col-md-4');

      const opcoes = `
        <div class="form-interesse">
          <label>Escolha sua opção de interesse:</label>
          <select class="form-select interesse-select">
            <option value="">-- Selecione --</option>
            <option value="pago_retirada">Tenho interesse e pago R$ pelo(s) item(s) e retiro no endereço</option>
            <option value="gratuito_retirada">Tenho interesse e posso retirar no local, sem pagar nada</option>
            <option value="cobro_retirada">Cobro R$ para retirar o item e dar destino apropriado</option>
          </select>
          <input type="number" class="form-control mt-2 valor-input" placeholder="Insira o valor (se aplicável)" style="display:none;" min="0" step="0.01">
          <button class="btn btn-success mt-2 btn-enviar">Enviar Interesse</button>
        </div>
      `;

      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          ${item.foto ? `<img src="${item.foto}" class="card-img-top" alt="${item.nome}">` : ''}
          <div class="card-body">
            <h5 class="card-title">${item.nome}</h5>
            <p class="card-text">${item.descricao}</p>
            <p><strong>Categoria:</strong> ${item.categoria}</p>
            <p><strong>Preço:</strong> R$ ${item.preco}</p>
            <p><strong>Quantidade:</strong> ${item.quantidade}</p>
            <p><strong>Localização:</strong> ${item.localizacao}</p>
            <p><strong>Disponível por:</strong> ${item.tempo} dias</p>
            ${opcoes}
            <div class="mt-3">
              <h6>Interesses Recebidos:</h6>
              <ul class="list-interesses"></ul>
            </div>
          </div>
        </div>
      `;

      listaItens.appendChild(card);

      const select = card.querySelector('.interesse-select');
      const inputValor = card.querySelector('.valor-input');
      const btnEnviar = card.querySelector('.btn-enviar');
      const listaInteresses = card.querySelector('.list-interesses');

      select.addEventListener('change', () => {
        inputValor.style.display = (select.value === 'pago_retirada' || select.value === 'cobro_retirada') ? 'block' : 'none';
        if (select.value !== 'pago_retirada' && select.value !== 'cobro_retirada') inputValor.value = '';
      });

      btnEnviar.addEventListener('click', () => {
        const opcao = select.value;
        const valor = parseFloat(inputValor.value) || 0;

        if (!opcao) {
          alert('Selecione uma opção de interesse!');
          return;
        }

        let descricao = '';
        if (opcao === 'pago_retirada') descricao = `Tenho interesse e pago R$ ${valor.toFixed(2)} pelo(s) item(s) e retiro no endereço.`;
        if (opcao === 'gratuito_retirada') descricao = `Tenho interesse e posso retirar no local, sem pagar nada.`;
        if (opcao === 'cobro_retirada') descricao = `Cobro R$ ${valor.toFixed(2)} para retirar o item e dar destino apropriado.`;

        item.interesses.push(descricao);
        localStorage.setItem('itens', JSON.stringify(itens));
        renderizaInteresses(listaInteresses, item.interesses);

        select.value = '';
        inputValor.value = '';
        inputValor.style.display = 'none';
      });

      renderizaInteresses(listaInteresses, item.interesses);
    });
  }

  filtroInput.addEventListener('input', () => {
    const termo = filtroInput.value.toLowerCase();
    const itensFiltrados = itens.filter(item =>
      item.nome.toLowerCase().includes(termo) ||
      item.categoria.toLowerCase().includes(termo)
    );
    exibirItens(itensFiltrados);
  });

  exibirItens();
});