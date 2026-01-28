function toggleTheme() {
    const themeButton = document.getElementById('theme-button');

    // 1. Verificar preferencias
    const temaGuardado = localStorage.getItem('tema');
    const prefiereTemaOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // 2. Aplicar tema inicial
    if (temaGuardado === 'dark' || (!temaGuardado && prefiereTemaOscuro)) {
        activarTemaOscuro();
    }

    // 3. Event listener para el botón
    themeButton.addEventListener('click', function() {
        const estaOscuro = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (estaOscuro) {
            desactivarTemaOscuro();
        } else {
            activarTemaOscuro();
        }
    });

    // 4. Función para activar tema oscuro
    function activarTemaOscuro() {
        document.documentElement.setAttribute('data-theme', 'dark');
        actualizarUI('oscuro');
        localStorage.setItem('tema', 'dark');
    }

    // 5. Función para desactivar tema oscuro
    function desactivarTemaOscuro() {
        document.documentElement.removeAttribute('data-theme');
        actualizarUI('claro');
        localStorage.setItem('tema', 'light');
    }

    // 6. Función para actualizar UI (mejorada)
    function actualizarUI(tema) {
        const icon = themeButton.querySelector('i');
        
        if (tema === 'oscuro') {
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
            themeButton.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
        } else {
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            themeButton.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
        }
    }
}

document.addEventListener('DOMContentLoaded', toggleTheme);