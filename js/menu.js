// ========== MÓDULO DEL MENÚ ==========
(function () {
    const menu = document.querySelector('.menu_hamburger');
    const menuLinks = document.querySelector('.menu_links');
    const menuItems = document.querySelectorAll('.menu_item--show');

    /* Toggle menú hamburguesa */
    menu.addEventListener('click', () => {
        menuLinks.classList.toggle('menu_links--show');
    });

    /* Toggle submenús solo en mobile */
    menuItems.forEach(item => {
        const link = item.querySelector('.menu_link');

        link.addEventListener('click', (e) => {
            if (window.innerWidth > 900) return;
            
            e.preventDefault();
            const estaActivo = item.classList.contains('menu_item--active');
            
            // Cerrar todos primero
            menuItems.forEach(otherItem => {
                otherItem.classList.remove('menu_item--active');
            });
            
            // Abrir solo si no estaba activo
            if (!estaActivo) {
                item.classList.add('menu_item--active');
            }
        });
    });

    /* Reset estilos al volver a desktop con debouncing */
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 900) {
                menuLinks.classList.remove('menu_links--show');
                menuItems.forEach(item => {
                    item.classList.remove('menu_item--active');
                });
            }
        }, 150);
    });
})();
