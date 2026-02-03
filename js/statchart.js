let statsChart = null;
function formatStatName(statName) {
    switch(statName){
        case 'hp': 
            return 'HP';
        case 'attack': 
            return 'Attack';
        case 'defense': 
            return 'Defense';   
        case 'special-attack': 
            return 'Sp. Atk';
        case 'special-defense': 
            return 'Sp. Def';
        case 'speed': 
            return 'Speed';
        default:
            return statName;
    }
}

function getChartColors() { 
    return ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
}

function createStatsChart(statsData, pokemonName) {
    console.log('🔄 Creando gráfico para:', pokemonName);
    
    // ============================================
    // 1. VERIFICAR QUE EL CANVAS EXISTE
    // ============================================
    const canvas = document.getElementById('stats-chart');
    if (!canvas) {
        console.error('❌ No se encontró el canvas con id "stats-chart"');
        console.log('💡 Asegúrate de tener en tu HTML: <canvas id="stats-chart"></canvas>');
        return; // Salir de la función si no hay canvas
    }
    
    // Obtener el contexto 2D para dibujar
    const ctx = canvas.getContext('2d');
    
    // ============================================
    // 2. PREPARAR LOS DATOS PARA CHART.JS
    // ============================================
    
    // 2A. Arrays vacíos para labels y valores
    const labels = [];   // Ej: ['HP', 'Attack', 'Defense', ...]
    const dataValues = []; // Ej: [45, 49, 49, 65, 65, 45]
    
    // 2B. Recorrer cada stat del Pokémon
    // statsData tiene 6 elementos, uno por cada stat
    statsData.forEach(function(statObject) {
        // statObject = {stat: {name: 'hp'}, base_stat: 45}
        
        // Extraer el nombre técnico (ej: 'special-attack')
        const rawStatName = statObject.stat.name;
        
        // Convertir a nombre bonito usando tu función formatStatName
        const prettyStatName = formatStatName(rawStatName);
        
        // Extraer el valor numérico (ej: 65)
        const statValue = statObject.base_stat;
        
        // Agregar a los arrays
        labels.push(prettyStatName);
        dataValues.push(statValue);
    });
    
    // ============================================
    // 3. OBTENER COLORES PARA EL GRÁFICO
    // ============================================
    const colors = getChartColors(); // Tu función que devuelve 6 colores
    
    // ============================================
    // 4. LIMPIAR GRÁFICO ANTERIOR SI EXISTE
    // ============================================
    if (statsChart) {
        console.log('🗑️ Destruyendo gráfico anterior');
        statsChart.destroy();
        statsChart = null;
    }
    
    // ============================================
    // 5. CREAR EL NUEVO GRÁFICO CON CHART.JS
    // ============================================
    try {
        console.log('🎨 Configurando nuevo gráfico...');
        
        statsChart = new Chart(ctx, {
            // Tipo de gráfico: pastel (pie chart)
            type: 'radar',
            
            // Datos del gráfico
            data: {
                labels: labels,          // Nombres de las stats
                datasets: [{             // Puedes tener múltiples datasets
                    label: `stats of ${pokemonName}`,
                    data: dataValues,    // Valores numéricos
                    backgroundColor: colors, // Colores de cada porción
                    borderColor: '#FFFFFF',  // Color del borde blanco
                    borderWidth: 2,          // Grosor del borde
                    hoverOffset: 15          // Efecto al pasar mouse
                }]
            },
            
            // Opciones de personalización
            options: {
                // Hacer el gráfico responsive
                responsive: true,
                
                // Mantener proporción (aspect ratio)
                maintainAspectRatio: true,
                
                // Configurar plugins
                plugins: {
                    // Leyenda (explica qué color es cada stat)
                    legend: {
                        position: 'bottom',      // Abajo del gráfico
                        labels: {
                            padding: 20,         // Espacio entre items
                            usePointStyle: true, // Usar puntos en vez de cuadrados
                            font: {
                                size: 12         // Tamaño de fuente
                            }
                        }
                    },
                    
                    // Tooltip (información al pasar mouse)
                    tooltip: {
                        callbacks: {
                            // Personalizar el texto del tooltip
                            label: function(context) {
                                // context tiene: label, value, etc.
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    },
                    
                    // Título del gráfico
                    title: {
                        display: true,
                        text: `Stats de ${pokemonName}`,
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
        
        console.log('✅ Gráfico creado exitosamente!');
        
    } catch (error) {
        // Si algo sale mal, mostrar error en consola
        console.error('💥 Error al crear el gráfico:', error);
        console.log('🔧 Posibles soluciones:');
        console.log('1. Verifica que Chart.js esté cargado');
        console.log('2. Revisa la consola por errores previos');
        console.log('3. Los datos deben ser números válidos');
    }
}