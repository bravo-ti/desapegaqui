// Recupera os itens do LocalStorage
let itens = JSON.parse(localStorage.getItem('itens')) || [];

const listaItens = document.getElementById('lista-itens');
const filtroInput = document.getElementById('filtro');

// Função para exibir os itens na tela
function exibirItens(itensParaExibir) {
  listaItens.innerHTML = ''; // Limpa a lista

  itensParaExibir.forEach((item, index) => {
    const card = document.createElement('div');
    card.classList.add('col-md-4');

    card.innerHTML = `
      <div class="card h-100">
        ${item.foto ? `<img src="${item.foto}" class="card-img-top" alt="${item.nome}">` : ''}
        <div class="card-body">
          <h5 class="card-title">${item.nome}</h5>
          <p class="card-text">${item.descricao}</p>
          <p><strong>Categoria:</strong> ${item.categoria}</p>
          <p><strong>Preço:</strong> R$ ${item.preco}</p>
          <p><strong>Quantidade:</strong> ${item.quantidade}</p>
          <p><strong>Localização:</strong> ${item.localizacao}</p>
          <p><strong>Disponível por:</strong> ${item.tempo} dias</p>
        </div>
      </div>
    `;

    listaItens.appendChild(card);
  });

  if(itensParaExibir.length === 0){
    listaItens.innerHTML = `<p class="text-center">Nenhum item cadastrado.</p>`;
  }
}

// Exibir todos os itens inicialmente
exibirItens(itens);

// Filtro por nome ou categoria
filtroInput.addEventListener('input', () => {
  const termo = filtroInput.value.toLowerCase();
  const itensFiltrados = itens.filter(item => 
    item.nome.toLowerCase().includes(termo) ||
    item.categoria.toLowerCase().includes(termo)
  );
  exibirItens(itensFiltrados);
});

// Recupera o input do filtro
const filtroInput = document.getElementById('filtro');

// Função que filtra e exibe os itens
filtroInput.addEventListener('input', () => {
  const termo = filtroInput.value.toLowerCase(); // converte para minúscula

  // Filtra os itens do LocalStorage
  const itensFiltrados = itens.filter(item => 
    item.nome.toLowerCase().includes(termo) || // filtra pelo nome
    item.categoria.toLowerCase().includes(termo) // filtra pela categoria
  );

  // Chama a função para exibir os itens filtrados
  exibirItens(itensFiltrados);
});
