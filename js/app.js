// ========== MÓDULO DE POKÉMON ==========
(function() {
    const listaPokemon = document.querySelector('#lista-pokemon');
    const buscadorInput = document.getElementById('buscador-pokemon');
    const limpiarBtn = document.getElementById('limpiar-busqueda');
    
    // Selectores específicos para tu estructura
    const botonesTipo = document.querySelectorAll('.boton-header:not(.generation)');
    const botonesGeneracion = document.querySelectorAll('.boton-header.generation');
    
    const URL = 'https://pokeapi.co/api/v2/pokemon/';
    
    // Cache de Pokémon
    let todosPokemon = [];
    let pokemonCargado = false;
    let cargaEnProgreso = false;
    
    // Botón activo actual
    let filtroActivo = 'ver-todas';
    let tipoFiltroActivo = 'tipo';
    
    // Variables para el buscador
    let busquedaActual = '';
    let timeoutBusqueda;

    // Definición de generaciones de Pokémon
    const generaciones = [
        { id: 'kanto', inicio: 1, fin: 151, nombre: 'Kanto' },
        { id: 'johto', inicio: 152, fin: 251, nombre: 'Johto' },
        { id: 'hoenn', inicio: 252, fin: 386, nombre: 'Hoenn' },
        { id: 'sinnoh', inicio: 387, fin: 493, nombre: 'Sinnoh' },
        { id: 'unova', inicio: 494, fin: 649, nombre: 'Unova' },
        { id: 'kalos', inicio: 650, fin: 721, nombre: 'Kalos' },
        { id: 'alola', inicio: 722, fin: 809, nombre: 'Alola' },
        { id: 'galar', inicio: 810, fin: 898, nombre: 'Galar' },
        { id: 'paldea', inicio: 906, fin: 1025, nombre: 'Paldea' },
        { id: 'hisui', inicio: 899, fin: 905, nombre: 'Hisui' }
    ];

    // Loading state
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = `
        <div class="spinner"></div>
        <p>Cargando Pokémon...</p>
    `;
    loadingIndicator.style.cssText = `
        text-align: center;
        padding: 40px;
        font-size: 1.2rem;
        color: #666;
    `;

    function obtenerGeneracion(id) {
        const generacion = generaciones.find(gen => 
            id >= gen.inicio && id <= gen.fin
        );
        return generacion ? generacion.nombre : 'Desconocida';
    }

    function obtenerGeneracionPorID(idGeneracion) {
        return generaciones.find(gen => gen.id === idGeneracion);
    }

    // Mostrar loading
    function mostrarLoading() {
        listaPokemon.innerHTML = '';
        listaPokemon.appendChild(loadingIndicator);
    }

    // Ocultar loading
    function ocultarLoading() {
        const loading = listaPokemon.querySelector('.loading-indicator');
        if (loading) {
            loading.remove();
        }
    }

    // Manejar errores
    function mostrarError(mensaje) {
        listaPokemon.innerHTML = `
            <div class="error-mensaje" style="text-align: center; padding: 40px; color: #d32f2f;">
                <h3>Error</h3>
                <p>${mensaje}</p>
                <button id="reintentar-btn" style="margin-top: 20px; padding: 10px 20px; background: #1976d2; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Reintentar
                </button>
            </div>
        `;
        
        document.getElementById('reintentar-btn').addEventListener('click', cargarTodosPokemon);
    }

    // Función para actualizar botones activos
    function actualizarBotonesActivos(botonClickeado, tipo) {
        // Remover activo de todos los botones
        botonesTipo.forEach(b => b.classList.remove('active'));
        botonesGeneracion.forEach(b => b.classList.remove('active'));
        
        // Agregar activo al botón clickeado
        if (botonClickeado) {
            botonClickeado.classList.add('active');
        }
        
        // Actualizar estado
        if (botonClickeado) {
            filtroActivo = botonClickeado.id;
            tipoFiltroActivo = tipo;
        }
        
        // Limpiar la búsqueda cuando cambias de filtro
        if (buscadorInput && limpiarBtn) {
            buscadorInput.value = '';
            limpiarBtn.classList.remove('visible');
            busquedaActual = '';
        }
    }

    // Filtrar Pokémon por tipo
    function filtrarPorTipo(tipo) {
        if (tipo === 'ver-todos' || tipo === 'ver-todas') {
            return todosPokemon;
        }
        
        return todosPokemon.filter(poke => 
            poke.types.some(pokeType => pokeType.type.name.includes(tipo))
        );
    }

    // Filtrar Pokémon por generación
    function filtrarPorGeneracion(idGeneracion) {
        if (idGeneracion === 'ver-todas') {
            return todosPokemon;
        }
        
        const generacion = obtenerGeneracionPorID(idGeneracion);
        if (!generacion) return todosPokemon;
        
        return todosPokemon.filter(poke => 
            poke.id >= generacion.inicio && poke.id <= generacion.fin
        );
    }

    // Aplicar filtro actual
    function aplicarFiltro() {
        let pokemonsFiltrados = [];
        
        if (tipoFiltroActivo === 'tipo') {
            pokemonsFiltrados = filtrarPorTipo(filtroActivo);
        } else if (tipoFiltroActivo === 'generacion') {
            pokemonsFiltrados = filtrarPorGeneracion(filtroActivo);
        }
        
        mostrarPokemons(pokemonsFiltrados);
    }

    function buscarPokemon(termino) {
        const terminoLower = termino.toLowerCase();
        
        return todosPokemon.filter(poke => {
            const enNombre = poke.name.toLowerCase().includes(terminoLower);
            const enID = poke.id.toString().includes(termino);
            const enTipos = poke.types.some(type => 
                type.type.name.toLowerCase().includes(terminoLower)
            );
            return enNombre || enID || enTipos;
        });
    }

    // Cargar todos los Pokémon con cache
    async function cargarTodosPokemon() {
        if (pokemonCargado && todosPokemon.length > 0) {
            aplicarFiltro();
            return;
        }

        if (cargaEnProgreso) return;
        
        cargaEnProgreso = true;
        mostrarLoading();

        try {
            // Crear array de promesas
            const promises = [];
            const maxPokemon = 1025;
            
            // Dividir en lotes para no saturar
            const lotes = [];
            for (let i = 1; i <= maxPokemon; i += 50) {
                const lote = [];
                for (let j = i; j < i + 50 && j <= maxPokemon; j++) {
                    lote.push(fetch(URL + j).then(r => {
                        if (!r.ok) throw new Error(`Error ${r.status} cargando Pokémon ${j}`);
                        return r.json();
                    }));
                }
                lotes.push(lote);
            }

            // Procesar lotes secuencialmente
            for (const lote of lotes) {
                const resultados = await Promise.allSettled(lote);
                resultados.forEach(resultado => {
                    if (resultado.status === 'fulfilled') {
                        todosPokemon.push(resultado.value);
                    } else {
                        console.warn('Error en Pokémon:', resultado.reason);
                    }
                });
                
                // Mostrar progreso
                if (todosPokemon.length % 100 === 0) {
                    loadingIndicator.querySelector('p').textContent = 
                        `Cargando Pokémon... ${todosPokemon.length}/${maxPokemon}`;
                }
            }

            // Ordenar por ID
            todosPokemon.sort((a, b) => a.id - b.id);
            pokemonCargado = true;
            
            // Aplicar filtro inicial
            aplicarFiltro();
            
        } catch (error) {
            console.error('Error cargando Pokémon:', error);
            mostrarError('No se pudieron cargar los Pokémon. Intenta de nuevo.');
        } finally {
            cargaEnProgreso = false;
            ocultarLoading();
        }
    }

    // Función para mostrar múltiples Pokémon
    function mostrarPokemons(pokemons) {
        ocultarLoading();
        listaPokemon.innerHTML = '';
        
        if (pokemons.length === 0) {
            listaPokemon.innerHTML = `
                <div class="sin-resultados" style="text-align: center; padding: 40px;">
                    <p>No se encontraron Pokémon con ese filtro.</p>
                </div>
            `;
            return;
        }

        pokemons.forEach(poke => mostrarPokemon(poke));
    }

    // Función individual para mostrar un Pokémon
    function mostrarPokemon(poke) {
        let tipos = poke.types.map(type => 
            `<p class="${type.type.name} tipo">${type.type.name}</p>`
        ).join('');

        const div = document.createElement('div');
        div.classList.add('pokemon');
        div.innerHTML = `
            <p class="pokemon-id-back">#${poke.id}</p>
            <div class="pokemon-img">
                <img src="${poke.sprites.other['official-artwork'].front_default || poke.sprites.front_default}" 
                     alt="${poke.name}"
                     loading="lazy">
            </div>
            <div class="pokemon-info">
                <div class="nombre-contenedor">
                    <p class="pokemon-id">#${poke.id}</p>
                    <h2 class="pokemon-nombre">${poke.name}</h2>
                </div>
                <div class="pokemon-tipos">
                    ${tipos}
                </div> 
                <div class="pokemon-stats">
                    <p class="stat">${(poke.height / 10).toFixed(1)}m</p>
                    <p class="stat">${(poke.weight / 10).toFixed(1)}kg</p>
                    <p class="stat">${obtenerGeneracion(poke.id)}</p>
                </div>
            </div>
        `;
        listaPokemon.append(div);
    }

    // Configurar filtros por tipo
    function configurarFiltrosTipo() {
        botonesTipo.forEach(boton => {
            // Solo configurar si no es un botón de generación
            if (!boton.classList.contains('generation')) {
                boton.addEventListener('click', (event) => {
                    event.preventDefault();
                    if (!pokemonCargado) return;
                    
                    actualizarBotonesActivos(event.currentTarget, 'tipo');
                    aplicarFiltro();
                    
                    // Cerrar menú en móvil después de seleccionar
                    if (window.innerWidth <= 900) {
                        const menuLinks = document.querySelector('.menu_links');
                        menuLinks.classList.remove('menu_links--show');
                    }
                });
            }
        });
    }

    // Configurar filtros por generación
    function configurarFiltrosGeneracion() {
        botonesGeneracion.forEach(boton => {
            boton.addEventListener('click', (event) => {
                event.preventDefault();
                if (!pokemonCargado) return;
                
                actualizarBotonesActivos(event.currentTarget, 'generacion');
                aplicarFiltro();
                
                // Cerrar menú en móvil después de seleccionar
                if (window.innerWidth <= 900) {
                    const menuLinks = document.querySelector('.menu_links');
                    menuLinks.classList.remove('menu_links--show');
                    
                    // Cerrar también el submenú de generaciones
                    const menuItem = event.currentTarget.closest('.menu_item--show');
                    if (menuItem) {
                        menuItem.classList.remove('menu_item--active');
                    }
                }
            });
        });
    }

    function configurarBuscador() {
        // Verificar que los elementos existen
        if (!buscadorInput || !limpiarBtn) {
            console.log('Buscador: Elementos no encontrados');
            return;
        }
        
        console.log('Buscador: Configurando...');
        
        // Evento: escribir en el input
        buscadorInput.addEventListener('input', (event) => {
            const termino = event.target.value.trim();
            
            console.log('Buscando:', termino);
            
            // Mostrar/ocultar botón X
            if (termino === '') {
                limpiarBtn.classList.remove('visible');
            } else {
                limpiarBtn.classList.add('visible');
            }
            
            // Debouncing
            clearTimeout(timeoutBusqueda);
            timeoutBusqueda = setTimeout(() => {
                if (!pokemonCargado) {
                    console.log('Pokemon no cargados aun');
                    return;
                }
                
                busquedaActual = termino;
                
                if (termino === '') {
                    // Si esta vacio, volver al filtro actual
                    aplicarFiltro();
                } else {
                    // Buscar Pokemon
                    const resultados = buscarPokemon(termino);
                    mostrarPokemons(resultados);
                }
            }, 300);
        });
        
        // Evento: hacer clic en la X
        limpiarBtn.addEventListener('click', () => {
            console.log('Limpiando busqueda');
            buscadorInput.value = '';
            limpiarBtn.classList.remove('visible');
            busquedaActual = '';
            aplicarFiltro();
            buscadorInput.focus();
        });
        
        // Evento: Enter para buscar
        buscadorInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                console.log('Enter presionado');
                clearTimeout(timeoutBusqueda);
                const termino = buscadorInput.value.trim();
                busquedaActual = termino;
                
                if (termino === '') {
                    aplicarFiltro();
                } else {
                    const resultados = buscarPokemon(termino);
                    mostrarPokemons(resultados);
                }
            }
        });
    }

    // Inicializar
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Inicializando Pokedex...');
        
        cargarTodosPokemon();
        configurarFiltrosTipo();
        configurarFiltrosGeneracion();
        configurarBuscador();
        
        // Configurar botón "Ver todas" como activo inicial
        const botonVerTodas = document.getElementById('ver-todas');
        if (botonVerTodas) {
            botonVerTodas.classList.add('active');
        }
    });

})();