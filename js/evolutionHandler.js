function extractIdFromUrl(url) {
    const match = url.match(/\/(\d+)\/$/);
    return match ? match[1] : null;
}

function getPokemonImageUrl(pokemonId) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
}

function processEvolutionChain(chainNode, result = [], level = 0) {
    const pokemonName = chainNode.species.name;
    const pokemonId = extractIdFromUrl(chainNode.species.url);
    
    if (pokemonId) {
        result.push({
            name: pokemonName,
            id: pokemonId,
            level: level
        });
    }
    
    if (chainNode.evolves_to && chainNode.evolves_to.length > 0) {
        chainNode.evolves_to.forEach(evolution => {
            processEvolutionChain(evolution, result, level + 1);
        });
    }
    
    return result;
}

async function displayEvolutionChain(evolutionChainUrl) {
    try {
        const response = await fetch(evolutionChainUrl);
        const data = await response.json();
        const chainData = data.chain;
        
        const evolutions = processEvolutionChain(chainData);
        
        if (!evolutions || evolutions.length <= 1) {
            const container = document.getElementById('evolution-container');
            if (container) {
                container.innerHTML = '<p class="no-evolutions">No tiene evoluciones</p>';
            }
            return;
        }
        
        const html = generateEvolutionHTML(evolutions);
        
        const container = document.getElementById('evolution-container');
        if (container) {
            container.innerHTML = html;
            
            // AQUÍ AÑADES LOS EVENT LISTENERS DESPUÉS DE INSERTAR EL HTML
            addEvolutionClickEvents();
        }
        
    } catch (error) {
        console.error('Error al obtener evoluciones:', error);
        const container = document.getElementById('evolution-container');
        if (container) {
            container.innerHTML = '<p class="error-evolutions">Error al cargar evoluciones</p>';
        }
    }
}

// NUEVA FUNCIÓN PARA LOS CLICKS
function addEvolutionClickEvents() {
    const evolutionStages = document.querySelectorAll('.evolution-stage');
    
    evolutionStages.forEach(stage => {
        stage.addEventListener('click', function() {
            const pokemonId = this.getAttribute('data-pokemon-id');
            if (pokemonId) {
                window.location.href = `pokemon.html?id=${pokemonId}`;
            }
        });
        
        // Opcional: cambiar cursor para indicar que es clickeable
        stage.style.cursor = 'pointer';
        stage.style.transition = 'transform 0.2s';
        
        // Efecto hover visual
        stage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });
        
        stage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

function generateEvolutionHTML(evolutions) {
    if (!evolutions || evolutions.length === 0) {
        return '<p class="no-evolutions">No se encontraron evoluciones</p>';
    }
    
    if (evolutions.length === 1) {
        const name = evolutions[0].name.charAt(0).toUpperCase() + evolutions[0].name.slice(1);
        return `<p class="single-pokemon">${name} no evoluciona</p>`;
    }
    
    let html = '<div class="evolution-chain">';
    
    evolutions.forEach((pokemon, index) => {
        const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        const imgUrl = getPokemonImageUrl(pokemon.id);
        
        html += `
            <div class="evolution-stage" data-pokemon-id="${pokemon.id}">
                <img src="${imgUrl}" alt="${name}" class="evolution-img">
                <span class="evolution-name">${name}</span>
            </div>
        `;
        
        if (index < evolutions.length - 1) {
            html += '<div class="evolution-arrow">→</div>';
        }
    });
    
    html += '</div>';
    return html;
}
window.displayEvolutionChain = displayEvolutionChain;
window.generateEvolutionHTML = generateEvolutionHTML;
window.processEvolutionChain = processEvolutionChain;
window.extractIdFromUrl = extractIdFromUrl;
window.getPokemonImageUrl = getPokemonImageUrl;