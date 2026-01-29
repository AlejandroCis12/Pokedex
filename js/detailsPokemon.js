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
        
        // 3. Encontrar la categoría en inglés
        const englishGenus = speciesData.genera.find(g => g.language.name === 'en');
        const category = englishGenus ? englishGenus.genus : "Pokémon";
        
        // 4. Combinar los datos
        const completePokemonData = {
            ...pokemonData,
            category: category
        };
        
        // 5. Mostrar la información completa
        displayPokemonInformation(completePokemonData);
        
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
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

    let tipos = pokemon.types.map(type => 
        `<div class="${type.type.name}">${type.type.name}</div>`
        ).join('');
        
    const currentId = document.getElementById('current-id');
    pokemonNameElement.textContent = `${pokemon.name} #${pokemon.id}`;
    currentId.textContent = pokemon.id;
    pokemonImgElement.src = pokemon.sprites.other['official-artwork'].front_default;
    typeElement.innerHTML = tipos;
    heightElement.textContent = `${(pokemon.height / 10).toFixed(1)}m`;
    weightElement.textContent = `${(pokemon.weight / 10).toFixed(1)}kg`;
    categoryElement.textContent = pokemon.category;
    abilityElement.textContent = pokemon.abilities.map(ability => ability.ability.name).join(', ');
    
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
