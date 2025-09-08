const toggleMenuBtn = document.getElementById('toggle-menu-btn');
const body = document.body;

toggleMenuBtn.addEventListener('click', () => {
    body.classList.toggle('menu-collapsed');

    // Atualiza o ícone do botão e o título
    if (body.classList.contains('menu-collapsed')) {
        toggleMenuBtn.innerHTML = '»';
        toggleMenuBtn.title = 'Expandir menu';
    } else {
        toggleMenuBtn.innerHTML = '«';
        toggleMenuBtn.title = 'Recolher menu';
    }
});