const typeChart = {
    normal: {
        normal: 1,
        fire: 1,
        water: 1,
        electric: 1,
        grass: 1,
        ice: 1,
        fighting: 2,
        poison: 1,
        ground: 1,
        flying: 1,
        psychic: 1,
        bug: 1,
        rock: 1,
        ghost: 0,     // inmune
        dragon: 1,
        dark: 1,
        steel: 1,
        fairy: 1
    },
    fire: {
        normal: 1,
        fire: 0.5,
        water: 2,
        electric: 1,
        grass: 0.5,
        ice: 0.5,
        fighting: 1,
        poison: 1,
        ground: 2,
        flying: 1,
        psychic: 1,
        bug: 0.5,
        rock: 2,
        ghost: 1,
        dragon: 0.5,
        dark: 1,
        steel: 0.5,
        fairy: 0.5
    },
    water: {
        normal: 1,
        fire: 0.5,
        water: 0.5,
        electric: 2,
        grass: 2,
        ice: 0.5,
        fighting: 1,
        poison: 1,
        ground: 1,
        flying: 1,
        psychic: 1,
        bug: 1,
        rock: 1,
        ghost: 1,
        dragon: 0.5,
        dark: 1,
        steel: 0.5,
        fairy: 1
    },
    electric: {
        normal: 1,
        fire: 1,
        water: 1,
        electric: 0.5,
        grass: 0.5,
        ice: 1,
        fighting: 1,
        poison: 1,
        ground: 2,
        flying: 0.5,
        psychic: 1,
        bug: 1,
        rock: 1,
        ghost: 1,
        dragon: 0.5,
        dark: 1,
        steel: 0.5,
        fairy: 1
    },
    grass: {
        normal: 1,
        fire: 2,
        water: 0.5,
        electric: 0.5,
        grass: 0.5,
        ice: 2,
        fighting: 1,
        poison: 2,
        ground: 0.5,
        flying: 2,
        psychic: 1,
        bug: 2,
        rock: 1,
        ghost: 1,
        dragon: 0.5,
        dark: 1,
        steel: 0.5,
        fairy: 1
    },
    ice: {
        normal: 1,
        fire: 2,
        water: 0.5,
        electric: 1,
        grass: 1,
        ice: 0.5,
        fighting: 2,
        poison: 1,
        ground: 1,
        flying: 1,
        psychic: 1,
        bug: 1,
        rock: 2,
        ghost: 1,
        dragon: 1,
        dark: 1,
        steel: 2,
        fairy: 1
    },
    fighting: {
        normal: 1,
        fire: 1,
        water: 1,
        electric: 1,
        grass: 1,
        ice: 1,
        fighting: 1,
        poison: 1,
        ground: 1,
        flying: 2,
        psychic: 2,
        bug: 0.5,
        rock: 0.5,
        ghost: 1,
        dragon: 1,
        dark: 0.5,
        steel: 1,
        fairy: 2
    },
    poison: {
        normal: 1,
        fire: 1,
        water: 1,
        electric: 1,
        grass: 0.5,
        ice: 1,
        fighting: 0.5,
        poison: 0.5,
        ground: 2,
        flying: 1,
        psychic: 2,
        bug: 0.5,
        rock: 1,
        ghost: 1,
        dragon: 1,
        dark: 1,
        steel: 1,
        fairy: 0.5
    },
    ground: {
        normal: 1,
        fire: 1,
        water: 2,
        electric: 0,     // inmune
        grass: 2,
        ice: 2,
        fighting: 1,
        poison: 0.5,
        ground: 1,
        flying: 1,
        psychic: 1,
        bug: 1,
        rock: 0.5,
        ghost: 1,
        dragon: 1,
        dark: 1,
        steel: 1,
        fairy: 1
    },
    flying: {
        normal: 1,
        fire: 1,
        water: 1,
        electric: 2,
        grass: 0.5,
        ice: 2,
        fighting: 0.5,
        poison: 1,
        ground: 0,     // inmune
        flying: 1,
        psychic: 1,
        bug: 0.5,
        rock: 2,
        ghost: 1,
        dragon: 1,
        dark: 1,
        steel: 1,
        fairy: 1
    },
    psychic: {
        normal: 1,
        fire: 1,
        water: 1,
        electric: 1,
        grass: 1,
        ice: 1,
        fighting: 0.5,
        poison: 1,
        ground: 1,
        flying: 1,
        psychic: 0.5,
        bug: 2,
        rock: 1,
        ghost: 2,
        dragon: 1,
        dark: 2,
        steel: 1,
        fairy: 1
    },
    bug: {
        normal: 1,
        fire: 2,
        water: 1,
        electric: 1,
        grass: 0.5,
        ice: 1,
        fighting: 0.5,
        poison: 1,
        ground: 0.5,
        flying: 2,
        psychic: 1,
        bug: 1,
        rock: 2,
        ghost: 1,
        dragon: 1,
        dark: 1,
        steel: 1,
        fairy: 1
    },
    rock: {
        normal: 0.5,
        fire: 0.5,
        water: 2,
        electric: 1,
        grass: 2,
        ice: 1,
        fighting: 2,
        poison: 0.5,
        ground: 2,
        flying: 0.5,
        psychic: 1,
        bug: 1,
        rock: 1,
        ghost: 1,
        dragon: 1,
        dark: 1,
        steel: 2,
        fairy: 1
    },
    ghost: {
        normal: 0,     // inmune
        fire: 1,
        water: 1,
        electric: 1,
        grass: 1,
        ice: 1,
        fighting: 0,   // inmune
        poison: 0.5,
        ground: 1,
        flying: 1,
        psychic: 1,
        bug: 0.5,
        rock: 1,
        ghost: 2,
        dragon: 1,
        dark: 2,
        steel: 1,
        fairy: 1
    },
    dragon: {
        normal: 1,
        fire: 0.5,
        water: 0.5,
        electric: 0.5,
        grass: 0.5,
        ice: 2,
        fighting: 1,
        poison: 1,
        ground: 1,
        flying: 1,
        psychic: 1,
        bug: 1,
        rock: 1,
        ghost: 1,
        dragon: 2,
        dark: 1,
        steel: 1,
        fairy: 2
    },
    dark: {
        normal: 1,
        fire: 1,
        water: 1,
        electric: 1,
        grass: 1,
        ice: 1,
        fighting: 2,
        poison: 1,
        ground: 1,
        flying: 1,
        psychic: 0,   // inmune
        bug: 2,
        rock: 1,
        ghost: 0.5,
        dragon: 1,
        dark: 0.5,
        steel: 1,
        fairy: 2
    },
    steel: {
        normal: 0.5,
        fire: 2,
        water: 1,
        electric: 1,
        grass: 0.5,
        ice: 0.5,
        fighting: 2,
        poison: 0,     // inmune
        ground: 2,
        flying: 0.5,
        psychic: 0.5,
        bug: 0.5,
        rock: 0.5,
        ghost: 1,
        dragon: 0.5,
        dark: 1,
        steel: 0.5,
        fairy: 0.5
    },
    fairy: {
        normal: 1,
        fire: 1,
        water: 1,
        electric: 1,
        grass: 1,
        ice: 1,
        fighting: 0.5,
        poison: 2,
        ground: 1,
        flying: 1,
        psychic: 1,
        bug: 0.5,
        rock: 1,
        ghost: 1,
        dragon: 0,     // inmune
        dark: 0.5,
        steel: 2,
        fairy: 1
    }
};

// Lista de todos los tipos para iterar
const allTypes = ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'];

function getMultiplier(attackingType, defendingType) {
    if (!typeChart[attackingType]) {
        return 1;
    }

    if (typeChart[attackingType][defendingType] !== undefined) {
        return typeChart[attackingType][defendingType];
    }
    return 1;
}

function getMultiplier(attackingType, defendingType) {
    // Siempre retorna un valor (1 si no está definido)
    return typeChart[attackingType]?.[defendingType] ?? 1;
}

function calculateWeaknesses(pokemonTypes) {
    const results = {};
    
    // Para cada tipo posible ATACANTE
    allTypes.forEach(attackingType => {
        let totalMultiplier = 1;
        
        // Multiplicar efectividad contra cada tipo del Pokémon
        pokemonTypes.forEach(defendingType => {
            totalMultiplier *= getMultiplier(defendingType , attackingType);
        });
        
        results[attackingType] = totalMultiplier;
    });
    
    // Filtrar solo debilidades (> 1)
    const weaknesses = Object.entries(results)
        .filter(([type, multiplier]) => multiplier > 1)
        .map(([type, multiplier]) => ({
            type: type,
            multiplier: multiplier
        }));
    
    return weaknesses;
}

function displayWeaknesses(weaknesses, containerId = 'weakness-container') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Contenedor #${containerId} no encontrado`);
        return;
    }
    
    if (!weaknesses || weaknesses.length === 0) {
        container.innerHTML = '<p class="no-weakness">No tiene debilidades</p>';
        return;
    }
    
    // Ordenar: 4x primero, luego 2x
    const sortedWeaknesses = weaknesses.sort((a, b) => b.multiplier - a.multiplier);
    
    const weaknessesHTML = sortedWeaknesses.map(weak => {
        const typeName = weak.type.charAt(0).toUpperCase() + weak.type.slice(1);
        const multiplierText = weak.multiplier === 4 ? '4×' : '2×';
        
        return `
            <div class="weakness-item ${weak.type}">
                <div class="weakness-type">${typeName}</div>
                <div class="weakness-multiplier">${multiplierText}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = weaknessesHTML;
}

// Hacer disponible globalmente
window.calculateWeaknesses = calculateWeaknesses;
window.displayWeaknesses = displayWeaknesses;