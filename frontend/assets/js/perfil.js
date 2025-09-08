document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. VERIFICAÇÃO DE LOGIN ---
    // Pega o usuário logado do localStorage
    const userJSON = localStorage.getItem('loggedInUser');

    // Se não houver usuário, redireciona para a página de login
    if (!userJSON) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'entrar.html';
        return; // Para a execução do script para evitar erros
    }

    // Converte a string JSON de volta para um objeto JavaScript
    const user = JSON.parse(userJSON);

    // --- 2. SELEÇÃO DOS ELEMENTOS DO HTML ---
    const emailDisplay = document.getElementById('user-email-display');
    const profileForm = document.getElementById('profile-form');
    const tipoFisicaRadio = document.getElementById('tipo-fisica');
    const tipoJuridicaRadio = document.getElementById('tipo-juridica');
    const juridicaFields = document.getElementById('juridica-fields');
    const nomeInput = document.getElementById('nome');
    const telefoneInput = document.getElementById('telefone');
    const nomeEmpresaInput = document.getElementById('nome-empresa');
    const ramoAtividadeInput = document.getElementById('ramo-atividade');

    // --- 3. FUNÇÕES ---

    // Função para mostrar/esconder os campos de pessoa jurídica
    function toggleJuridicaFields() {
        if (tipoJuridicaRadio.checked) {
            juridicaFields.style.display = 'block';
        } else {
            juridicaFields.style.display = 'none';
        }
    }

    // Função para carregar os dados do usuário no formulário
    function loadProfileData() {
        emailDisplay.textContent = user.email;
        nomeInput.value = user.nome || '';
        telefoneInput.value = user.telefone || '';
        
        // Verifica e seleciona o tipo de conta salvo
        if (user.tipoConta === 'juridica') {
            tipoJuridicaRadio.checked = true;
            nomeEmpresaInput.value = user.nomeEmpresa || '';
            ramoAtividadeInput.value = user.ramoAtividade || '';
        } else {
            tipoFisicaRadio.checked = true;
        }

        // Garante que os campos PJ sejam exibidos ou ocultados corretamente ao carregar
        toggleJuridicaFields();
    }

    // --- 4. EVENT LISTENERS (OUVINTES DE EVENTOS) ---

    // Adiciona "ouvintes" para os botões de rádio que ativam a função de toggle
    tipoFisicaRadio.addEventListener('change', toggleJuridicaFields);
    tipoJuridicaRadio.addEventListener('change', toggleJuridicaFields);

    // Adiciona "ouvinte" para o envio do formulário
    profileForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o recarregamento da página

        // Atualiza o objeto 'user' com os novos dados do formulário
        user.nome = nomeInput.value;
        user.telefone = telefoneInput.value;
        user.tipoConta = tipoJuridicaRadio.checked ? 'juridica' : 'fisica';

        if (user.tipoConta === 'juridica') {
            user.nomeEmpresa = nomeEmpresaInput.value;
            user.ramoAtividade = ramoAtividadeInput.value;
        } else {
            // Remove os campos de PJ se o usuário mudar para PF
            delete user.nomeEmpresa;
            delete user.ramoAtividade;
        }

        // Salva o objeto atualizado de volta no localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(user));

        alert('Perfil atualizado com sucesso!');
    });

    // --- 5. INICIALIZAÇÃO ---
    // Carrega os dados do perfil assim que a página é aberta
    loadProfileData();
});