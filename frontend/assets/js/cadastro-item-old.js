document.addEventListener('DOMContentLoaded', () => {
    // --- SELEÇÃO DOS ELEMENTOS ---
    const form = document.getElementById('item-form'); // Usando o ID do seu formulário
    const mensagemSucesso = document.getElementById('mensagem-sucesso');
    const botoesOpcao = document.getElementById('botoes-opcao');
    const btnEnviar = form.querySelector('button[type="submit"]'); // Seleciona o botão de submit do form
    const btnResetar = document.getElementById('btn-resetar');
    const btnVerItens = document.getElementById('btn-ver-itens');

    // Se algum elemento principal não for encontrado, interrompe para evitar erros.
    if (!form || !mensagemSucesso || !botoesOpcao || !btnResetar || !btnVerItens) {
        console.error('Um ou mais elementos do formulário não foram encontrados no HTML.');
        return;
    }

    // --- FUNÇÕES DE CONTROLE DA INTERFACE (UI) ---

    /**
     * Desabilita todos os campos do formulário após o envio bem-sucedido.
     */
    function desabilitarCampos() {
        const campos = form.querySelectorAll('input, textarea, select');
        campos.forEach(campo => campo.disabled = true);
        btnEnviar.disabled = true;
    }

    /**
     * Reseta o formulário para permitir um novo cadastro.
     */
    function resetarFormulario() {
        form.reset();
        const campos = form.querySelectorAll('input, textarea, select');
        campos.forEach(campo => campo.disabled = false);
        btnEnviar.disabled = false;
        mensagemSucesso.style.display = 'none';
        botoesOpcao.style.display = 'none';
    }

    /**
     * Redireciona o usuário para a página de "meus itens".
     */
    function verMeusItens() {
        // Altere 'home.html' para a página correta onde os itens são listados
        window.location.href = 'home.html';
    }
    
    // --- FUNÇÃO DE LÓGICA DE DADOS ---

    /**
     * Salva o objeto do item no localStorage.
     * @param {object} item O objeto contendo os dados do item a ser salvo.
     */
    function salvarItem(item) {
        const itens = JSON.parse(localStorage.getItem('anuncios')) || [];
        itens.push(item);
        localStorage.setItem('anuncios', JSON.stringify(itens));

        // Após salvar, atualiza a interface para mostrar o sucesso.
        desabilitarCampos();
        mensagemSucesso.style.display = 'block';
        botoesOpcao.style.display = 'flex';
    }

    // --- EVENT LISTENER PRINCIPAL DO FORMULÁRIO ---
    
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Impede o envio padrão do formulário

        // 1. Coleta os dados do formulário
        const novoAnuncio = {
            id: 'anuncio-' + Date.now(),
            titulo: document.getElementById('item-titulo').value,
            detalhes: document.getElementById('item-detalhes').value,
            valor: parseFloat(document.getElementById('item-valor').value).toFixed(2),
            categoria: document.getElementById('item-categoria').value,
            expiracaoDias: parseInt(document.getElementById('item-expiracao').value),
            dataCadastro: new Date().toISOString(),
            imagemBase64: null // Inicia como nulo
        };

        // 2. Processa o arquivo de imagem
        const fotoInput = document.getElementById('item-foto');
        const fotoFile = fotoInput.files[0];

        if (fotoFile) {
            const reader = new FileReader();
            
            // A leitura do arquivo é assíncrona, então salvamos quando ela terminar
            reader.onload = () => {
                novoAnuncio.imagemBase64 = reader.result;
                salvarItem(novoAnuncio); // Salva o item com a imagem
            };
            
            reader.readAsDataURL(fotoFile); // Inicia a conversão para Base64
        } else {
            salvarItem(novoAnuncio); // Salva o item sem imagem
        }
    });

    // --- EVENT LISTENERS DOS BOTÕES DE OPÇÃO ---
    btnResetar.addEventListener('click', resetarFormulario);
    btnVerItens.addEventListener('click', verMeusItens);
});