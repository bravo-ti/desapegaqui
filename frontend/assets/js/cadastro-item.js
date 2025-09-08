document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-item');
  const mensagem = document.getElementById('mensagem-sucesso');
  const botoes = document.getElementById('botoes-opcao');
  const btnEnviar = document.getElementById('btn-enviar');
  const btnResetar = document.getElementById('btn-resetar');
  const btnVerItens = document.getElementById('btn-ver-itens');

  function desabilitarCampos() {
    const campos = form.querySelectorAll('input, textarea, select');
    campos.forEach(campo => campo.disabled = true);
    btnEnviar.disabled = true;
  }

  function resetarFormulario() {
    form.reset();
    const campos = form.querySelectorAll('input, textarea, select');
    campos.forEach(campo => campo.disabled = false);
    btnEnviar.disabled = false;
    mensagem.style.display = 'none';
    botoes.style.display = 'none';
  }

  function verMeusItens() {
    window.location.href = 'meus-itens.html';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Aqui você pode adicionar lógica de envio real (ex: salvar em banco de dados)

    desabilitarCampos();
    mensagem.style.display = 'block';
    botoes.style.display = 'flex';
  });

  btnResetar.addEventListener('click', resetarFormulario);
  btnVerItens.addEventListener('click', verMeusItens);
});

const form = document.getElementById('form-item');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Criar objeto com os dados do formulário
  const item = {
    nome: document.getElementById('nome').value,
    descricao: document.getElementById('descricao').value,
    categoria: document.getElementById('categoria').value,
    preco: document.getElementById('preco').value,
    quantidade: document.getElementById('quantidade').value,
    localizacao: document.getElementById('localizacao').value,
    tempo: document.getElementById('tempo').value,
    foto: null
  };

  // Ler a foto como Base64
  const file = document.getElementById('foto').files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = () => {
      item.foto = reader.result;

      salvarItem(item);
    };
    reader.readAsDataURL(file); // converte em Base64
  } else {
    salvarItem(item);
  }
});

function salvarItem(item){
  // Recupera lista existente ou cria uma nova
  const itens = JSON.parse(localStorage.getItem('itens')) || [];
  itens.push(item);

  localStorage.setItem('itens', JSON.stringify(itens));

  // Mensagem de sucesso
  document.getElementById('mensagem-sucesso').style.display = 'block';
  document.getElementById('botoes-opcao').style.display = 'flex';
  document.getElementById('form-item').reset();
}
