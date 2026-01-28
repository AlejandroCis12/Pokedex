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

    // Loading state optimizado para móvil
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = `
        <div class="spinner"></div>
        <p>Cargando Pokémon...</p>
        <p class="loading-progress">0/151</p>
    `;
    loadingIndicator.style.cssText = `
        text-align: center;
        padding: 40px;
        font-size: 1.2rem;
        color: #666;
        grid-column: 1 / -1;
    `;

    // Elemento para mostrar progreso
    const progressText = loadingIndicator.querySelector('.loading-progress');

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
            <div class="error-mensaje" style="text-align: center; padding: 40px; color: #d32f2f; grid-column: 1 / -1;">
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

    // Cargar todos los Pokémon OPTIMIZADO PARA MÓVIL
    async function cargarTodosPokemon() {
        if (pokemonCargado && todosPokemon.length > 0) {
            aplicarFiltro();
            return;
        }

        if (cargaEnProgreso) return;
        
        cargaEnProgreso = true;
        mostrarLoading();

        try {
            // PARA MÓVIL: Solo cargar la primera generación inicialmente (151 Pokémon)
            const pokemonInicial = 151;
            const promises = [];
            
            // Crear promesas para los primeros 151 Pokémon
            for (let i = 1; i <= pokemonInicial; i++) {
                promises.push(
                    fetch(URL + i)
                        .then(r => {
                            if (!r.ok) throw new Error(`Error ${r.status}`);
                            return r.json();
                        })
                        .then(data => {
                            // Actualizar progreso en tiempo real
                            if (progressText) {
                                progressText.textContent = `${todosPokemon.length + 1}/${pokemonInicial}`;
                            }
                            return data;
                        })
                );
            }

            // Esperar TODOS los fetchs con Promise.allSettled
            const resultados = await Promise.allSettled(promises);
            
            // Procesar resultados
            resultados.forEach((resultado, index) => {
                if (resultado.status === 'fulfilled') {
                    todosPokemon.push(resultado.value);
                } else {
                    console.warn(`Error en Pokémon ${index + 1}:`, resultado.reason);
                    // Aún así continuamos con los demás
                }
            });

            // Ordenar por ID
            todosPokemon.sort((a, b) => a.id - b.id);
            pokemonCargado = true;
            
            // Aplicar filtro inicial (mostrará solo los 151 cargados)
            aplicarFiltro();
            
            // CARGAR EL RESTO EN SEGUNDO PLANO (sin bloquear la UI)
            setTimeout(() => cargarRestoPokemon(), 1000);
            
        } catch (error) {
            console.error('Error cargando Pokémon:', error);
            mostrarError('No se pudieron cargar los Pokémon. Intenta de nuevo.');
        } finally {
            cargaEnProgreso = false;
            ocultarLoading();
        }
    }

    // Función para cargar el resto de Pokémon en segundo plano
    async function cargarRestoPokemon() {
        if (todosPokemon.length >= 1025) return;
        
        console.log('Cargando el resto de Pokémon en segundo plano...');
        
        const inicio = 152;
        const fin = 1025;
        
        // Cargar en lotes pequeños para no saturar móvil
        const tamanoLote = 50;
        
        for (let i = inicio; i <= fin; i += tamanoLote) {
            const lotePromises = [];
            const limiteLote = Math.min(i + tamanoLote - 1, fin);
            
            for (let j = i; j <= limiteLote; j++) {
                lotePromises.push(
                    fetch(URL + j)
                        .then(r => r.ok ? r.json() : null)
                        .catch(() => null) // Ignorar errores en carga en segundo plano
                );
            }
            
            const resultadosLote = await Promise.allSettled(lotePromises);
            
            resultadosLote.forEach(resultado => {
                if (resultado.status === 'fulfilled' && resultado.value) {
                    todosPokemon.push(resultado.value);
                }
            });
            
            // Ordenar periódicamente
            todosPokemon.sort((a, b) => a.id - b.id);
            
            // Pausa entre lotes para no saturar
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        console.log('Todos los Pokémon cargados en segundo plano');
    }

    // Función para mostrar múltiples Pokémon
    function mostrarPokemons(pokemons) {
        ocultarLoading();
        listaPokemon.innerHTML = '';
        
        if (pokemons.length === 0) {
            listaPokemon.innerHTML = `
                <div class="sin-resultados" style="text-align: center; padding: 40px; grid-column: 1 / -1;">
                    <p>No se encontraron Pokémon con ese filtro.</p>
                </div>
            `;
            return;
        }

        // Para móvil: mostrar máximo 50 Pokémon inicialmente
        const mostrarInicialmente = window.innerWidth <= 768 ? 50 : pokemons.length;
        const pokemonsAMostrar = pokemons.slice(0, mostrarInicialmente);
        
        pokemonsAMostrar.forEach(poke => mostrarPokemon(poke));
        
        // Si hay más Pokémon y estamos en móvil, agregar botón "Ver más"
        if (pokemons.length > mostrarInicialmente && window.innerWidth <= 768) {
            const verMasBtn = document.createElement('button');
            verMasBtn.className = 'ver-mas-btn';
            verMasBtn.textContent = `Ver más (${pokemons.length - mostrarInicialmente} restantes)`;
            verMasBtn.style.cssText = `
                grid-column: 1 / -1;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                cursor: pointer;
                margin: 20px auto;
                display: block;
                max-width: 300px;
            `;
            
            verMasBtn.addEventListener('click', () => {
                // Mostrar el resto de Pokémon
                for (let i = mostrarInicialmente; i < pokemons.length; i++) {
                    mostrarPokemon(pokemons[i]);
                }
                verMasBtn.remove();
            });
            
            listaPokemon.appendChild(verMasBtn);
        }
    }

    // Función individual para mostrar un Pokémon (CLICKEABLE)
    function mostrarPokemon(poke) {
        let tipos = poke.types.map(type => 
            `<p class="${type.type.name} tipo">${type.type.name}</p>`
        ).join('');

        const div = document.createElement('div');
        div.classList.add('pokemon');
        div.style.cursor = 'pointer';
        
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
        
        // HACER LA TARJETA CLICKEABLE
        div.addEventListener('click', () => {
            window.location.href = `pokemon.html?id=${poke.id}`;
        });
        
        listaPokemon.append(div);
    }

    // Configurar filtros por tipo
    function configurarFiltrosTipo() {
        botonesTipo.forEach(boton => {
            if (!boton.classList.contains('generation')) {
                boton.addEventListener('click', (event) => {
                    event.preventDefault();
                    if (!pokemonCargado) return;
                    
                    actualizarBotonesActivos(event.currentTarget, 'tipo');
                    aplicarFiltro();
                    
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
                
                if (window.innerWidth <= 900) {
                    const menuLinks = document.querySelector('.menu_links');
                    menuLinks.classList.remove('menu_links--show');
                    
                    const menuItem = event.currentTarget.closest('.menu_item--show');
                    if (menuItem) {
                        menuItem.classList.remove('menu_item--active');
                    }
                }
            });
        });
    }

    function configurarBuscador() {
        if (!buscadorInput || !limpiarBtn) {
            console.log('Buscador: Elementos no encontrados');
            return;
        }
        
        buscadorInput.addEventListener('input', (event) => {
            const termino = event.target.value.trim();
            
            if (termino === '') {
                limpiarBtn.classList.remove('visible');
            } else {
                limpiarBtn.classList.add('visible');
            }
            
            clearTimeout(timeoutBusqueda);
            timeoutBusqueda = setTimeout(() => {
                if (!pokemonCargado) return;
                
                busquedaActual = termino;
                
                if (termino === '') {
                    aplicarFiltro();
                } else {
                    const resultados = buscarPokemon(termino);
                    mostrarPokemons(resultados);
                }
            }, 300);
        });
        
        limpiarBtn.addEventListener('click', () => {
            buscadorInput.value = '';
            limpiarBtn.classList.remove('visible');
            busquedaActual = '';
            aplicarFiltro();
            buscadorInput.focus();
        });
        
        buscadorInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
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
        
        const botonVerTodas = document.getElementById('ver-todas');
        if (botonVerTodas) {
            botonVerTodas.classList.add('active');
        }
    });

})();