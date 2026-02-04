const URLParams = new URLSearchParams(window.location.search);
const pokemonId = URLParams.get('id');

const URL = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

async function fetchPokemonData() {
    try {
        // 1. Obtener datos básicos del pokémon
        const response = await fetch(URL);
        const pokemonData = await response.json();
        
        // 2. Obtener datos de la especie para la categoría
        const speciesResponse = await fetch(pokemonData.species.url);
        const speciesData = await speciesResponse.json();
        
           if (speciesData.evolution_chain && speciesData.evolution_chain.url) {
            if (typeof displayEvolutionChain === 'function') {
                await displayEvolutionChain(speciesData.evolution_chain.url);
            }
        }

        // 3. Encontrar la categoría en inglés
        const englishGenus = speciesData.genera.find(g => g.language.name === 'en');
        const category = englishGenus ? englishGenus.genus : "Pokémon";
        const description = getCategoryInEnglish(speciesData.flavor_text_entries);

        if (pokemonData.cries && pokemonData.cries.latest) {
        console.log("URL del sonido:", pokemonData.cries.latest);
        }
        
        // 4. Combinar los datos
        const completePokemonData = {
            ...pokemonData,
            category: category,
            gender_rate: speciesData.gender_rate,
            description: description
        };
        
        // 5. Mostrar la información completa
        displayPokemonInformation(completePokemonData);
        
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
    
}

function getGenderIcon(genderRate){
    if (genderRate === -1) {
        return '<i class="fa-solid fa-genderless"></i>'; 
    }
    if (genderRate === 0) {
        return `<i class="fa-solid fa-mars"></i>`;
    }
    if (genderRate === 8) {
        return `<i class="fa-solid fa-venus"></i>`;
    } else {
        const femalePercentage = (genderRate / 8) * 100;
        const malePercentage = 100 - femalePercentage;
        return `
            <i class="fa-solid fa-mars"></i>
            <i class="fa-solid fa-venus"></i>
        `;
    }             
}

function getCategoryInEnglish(flavorTextEntries) {
    const englishEntry = flavorTextEntries.filter(
        entry => entry.language.name === 'en'
    )
     if (englishEntry.length === 0) {
        return 'Description unknown';
     }

     const lastEntry = englishEntry[englishEntry.length - 1];

    return lastEntry.flavor_text
    .replace(/\n/g, ' ')    // Reemplazar saltos de línea
    .replace(/\f/g, ' ')    // Reemplazar form feeds
    .replace(/\s+/g, ' ')   // Múltiples espacios por uno
    .trim();
}

function getCryURL(pokemonID){
    return `https://pokemoncries.com/cries/${pokemonId}.mp3`;
}

function playPokemonCry(pokemonId, cryUrl = null) {
    try {
        // 1. Si no hay URL, construir una basada en ID
        const url = cryUrl || `https://pokemoncries.com/cries/${pokemonId}.mp3`;
        
        // 2. Crear objeto Audio
        const audio = new Audio(url);
        
        // 3. Configurar
        audio.volume = 0.7;
        
        // 4. Reproducir
        audio.play().catch(error => {
            console.log("Error al reproducir:", error.message);
            // Fallback: intentar otra fuente
        });
        
    } catch (error) {
        console.error("Error con el audio:", error);
    }
}


function displayPokemonInformation(pokemon) {
    const pokemonNameElement = document.getElementById('pokemon-name');
    const pokemonImgElement = document.getElementById('pokemon-imag').querySelector('img');
    const descriptionElement = document.getElementById('description');
    const typeElement = document.getElementById('types');
    const heightElement = document.getElementById('info-value');
    const weightElement = document.getElementById('Weight-value');
    const categoryElement = document.getElementById('category-value');
    const abilityElement = document.getElementById('ability-value');
    const genderElement = document.getElementById('gender-icons');
    const soundBtn = document.getElementById('sound-btn');
    const title = document.getElementById('title-pokemon');

    let tipos = pokemon.types.map(type => 
        `<div class="${type.type.name}">${type.type.name}</div>`
        ).join('');
    
    const pokemonTypes = pokemon.types.map(type => type.type.name);
    const currentId = document.getElementById('current-id');
    
    title.textContent = `Pokemon || ${pokemon.name}`;
    pokemonNameElement.textContent = `${pokemon.name} #${pokemon.id}`;
    currentId.textContent = pokemon.id;
    pokemonImgElement.src = pokemon.sprites.other['official-artwork'].front_default;

    if (descriptionElement && pokemon.description) {
        descriptionElement.textContent = pokemon.description;
    } else if (descriptionElement) {
        descriptionElement.textContent = "No description available";
    }

    // Mostrar debilidades
    if (typeof calculateWeaknesses === 'function') {
        const weaknesses = calculateWeaknesses(pokemonTypes);
        
        if (typeof displayWeaknesses === 'function') {
            displayWeaknesses(weaknesses);
        } else {
            console.warn('displayWeaknesses no está disponible');
        }
    }
    
    // Configurar botón de sonido
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            playPokemonCry(pokemon.id, pokemon.cryUrl);
        });
        
        if (!pokemon.cries) {
            soundBtn.disabled = true;
            soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        }
    }

    typeElement.innerHTML = tipos;
    heightElement.textContent = `${(pokemon.height / 10).toFixed(1)}m`;
    weightElement.textContent = `${(pokemon.weight / 10).toFixed(1)}kg`;
    categoryElement.textContent = pokemon.category;
    abilityElement.textContent = pokemon.abilities.map(ability => ability.ability.name).join(', ');
    genderElement.innerHTML = getGenderIcon(pokemon.gender_rate);
    
    // Mostrar gráfico de stats
    if (typeof createStatsChart === 'function') {
        createStatsChart(pokemon.stats, pokemon.name);
    } else {
        console.log('⚠️ chartStats.js no está cargado o createStatsChart no existe');
    }

}

function setupNavigationButtons() {
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const currentId = parseInt(pokemonId, 10);

    prevButton.href = `pokemon.html?id=${currentId > 1 ? currentId - 1 : 1025}`;
    nextButton.href = `pokemon.html?id=${currentId < 1025 ? currentId + 1 : 1}`;

    prevButton.addEventListener('click', function(event){
        event.preventDefault();
        window.location.href = prevButton.href;
    });

    nextButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = nextButton.href;
    });

    
}

setupNavigationButtons();
fetchPokemonData();
