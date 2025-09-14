// frontend/js/game.js

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const gameContainer = document.getElementById('game-container');
    const playerHandContainer = document.getElementById('player-hand');
    const enclosuresContainer = document.getElementById('enclosures-container');
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    const diceResultDisplay = document.getElementById('dice-result');
    const playerNameDisplay = document.getElementById('player-name');
    const turnCountDisplay = document.getElementById('turn-count');

    // Mapeo de especies de dinosaurios a imágenes (asumiendo que las tienes en /assets/dino_images/)
    const dinosaurImages = {
        'T-Rex': 'red.png',
        'Triceratops': 'green.png',
        'Brachiosaurus': 'light_blue.png',
        'Stegosaurus': 'blue.png',
        'Pterodactyl': 'yellow.png',
        'Velociraptor': 'violet.png'
    };

    // Estructuras de datos para el juego
    const gameData = {
        players: {}, // Almacena el estado de cada jugador
        currentPlayerId: null,
        currentTurn: 1,
        diceRule: null
    };

    // Definición de recintos con sus reglas y puntuaciones
    const enclosures = {
        'Rivera': {
            area: 'valle',
            country: 'Uruguay',
            maxDinos: 6,
            points: (dinos) => {
                if (dinos.length === 0) return 0;
                const scores = { 1: 2, 2: 4, 3: 8, 4: 12, 5: 18, 6: 24 };
                const firstDinoType = dinos[0];
                const allSameType = dinos.every(dino => dino === firstDinoType);
                return allSameType ? scores[dinos.length] || 0 : 0;
            },
            dinos: []
        },
        'Campo': {
            area: 'valle',
            country: 'Uruguay',
            maxDinos: 3,
            points: (dinos) => dinos.length === 3 ? 7 : 0,
            dinos: []
        },
        'Montevideo': {
            area: 'ciudad',
            country: 'Uruguay',
            points: (dinos) => {
                const dinoCounts = {};
                dinos.forEach(dino => {
                    dinoCounts[dino] = (dinoCounts[dino] || 0) + 1;
                });
                let totalPairs = 0;
                for (const type in dinoCounts) {
                    totalPairs += Math.floor(dinoCounts[type] / 2);
                }
                return totalPairs * 5;
            },
            dinos: []
        },
        'Chelyabinsk': {
            area: 'ciudad',
            country: 'Rusia',
            maxDinos: 1,
            points: (dinos) => {
                // Lógica de puntuación completa requiere saber si es la única especie en todo el mapa
                if (dinos.length === 1) return 7;
                return 0;
            },
            dinos: []
        },
        'Moskava': {
            area: 'ciudad',
            country: 'Rusia',
            points: (dinos) => {
                const scores = { 1: 1, 2: 3, 3: 6, 4: 10, 5: 15, 6: 21 };
                const uniqueDinos = new Set(dinos);
                return uniqueDinos.size === dinos.length ? scores[dinos.length] || 0 : 0;
            },
            dinos: []
        },
        'Transiveriano': {
            area: 'valle',
            country: 'Rusia',
            maxDinos: 1,
            points: (dinos) => {
                // Lógica de puntuación completa requiere comparar con otros jugadores
                if (dinos.length === 1) return 7;
                return 0;
            },
            dinos: []
        },
        'Rio': {
            points: (dinos) => 0, // El río no da puntos según las reglas proporcionadas
            dinos: []
        }
    };

    // Reglas del dado mapeadas a las áreas/países
    const diceRules = {
        'Ciudad': (enclosure) => enclosure.area === 'ciudad',
        'Uruguay': (enclosure) => enclosure.country === 'Uruguay',
        'Fósil': (enclosure) => enclosure.dinos.length === 0,
        'Rusia': (enclosure) => enclosure.country === 'Rusia',
        'Valle': (enclosure) => enclosure.area === 'valle',
        'Prohibido T-Rex': (enclosure) => !enclosure.dinos.includes('T-Rex')
    };

    // Variables de estado
    let selectedDino = null;

    // --- Funciones de inicialización y renderización ---

    async function initGame() {
        try {
            // Inicializar la mano del jugador desde el backend
            const handData = await getPlayerHand();
            gameData.players[sessionStorage.getItem('username')] = {
                hand: handData.hand,
                board: enclosures,
                score: 0
            };
            gameData.currentPlayerId = sessionStorage.getItem('username');

            renderBoard();
            renderPlayerHand();
            updateUI();
        } catch (error) {
            console.error('Error al inicializar el juego:', error);
            alert('No se pudo cargar el juego. Por favor, inténtalo de nuevo.');
        }
    }

    function renderBoard() {
        enclosuresContainer.innerHTML = '';
        const enclosureNames = Object.keys(enclosures);
        enclosureNames.forEach(name => {
            const enclosureDiv = document.createElement('div');
            enclosureDiv.classList.add('zona');
            enclosureDiv.setAttribute('data-enclosure', name);
            enclosureDiv.innerHTML = `<h3>${name}</h3>`;
            enclosureDiv.addEventListener('click', () => handleEnclosureClick(name));
            enclosuresContainer.appendChild(enclosureDiv);
        });
    }

    function renderPlayerHand() {
        playerHandContainer.innerHTML = '';
        const currentPlayer = gameData.players[gameData.currentPlayerId];
        currentPlayer.hand.forEach((dinoType, index) => {
            const dinoDiv = document.createElement('div');
            dinoDiv.classList.add('dino');
            dinoDiv.setAttribute('data-dino-type', dinoType);
            dinoDiv.setAttribute('data-dino-index', index);
            dinoDiv.innerHTML = `<img src="../../assets/dino_images/${dinosaurImages[dinoType]}" alt="${dinoType}">`;
            dinoDiv.addEventListener('click', () => selectDino(dinoDiv));
            playerHandContainer.appendChild(dinoDiv);
        });
    }

    function updateUI() {
        playerNameDisplay.textContent = gameData.currentPlayerId;
        turnCountDisplay.textContent = gameData.currentTurn;
        // Puntuación se recalcula al final del juego
    }

    // --- Funciones de interacción del juego ---

    function selectDino(dinoElement) {
        if (selectedDino) {
            selectedDino.classList.remove('selected');
        }
        selectedDino = dinoElement;
        selectedDino.classList.add('selected');
        console.log(`Dinosaurio seleccionado: ${dinoElement.dataset.dinoType}`);
        highlightValidEnclosures(selectedDino.dataset.dinoType);
    }

    function highlightValidEnclosures(dinoType) {
        document.querySelectorAll('.zona').forEach(enclosureDiv => {
            const enclosureName = enclosureDiv.dataset.enclosure;
            if (isPlacementValid(enclosureName, dinoType)) {
                enclosureDiv.classList.add('valid');
                enclosureDiv.classList.remove('invalid');
            } else {
                enclosureDiv.classList.remove('valid');
                enclosureDiv.classList.add('invalid');
            }
        });
    }

    function handleEnclosureClick(enclosureName) {
        if (!selectedDino) {
            alert('Por favor, selecciona un dinosaurio para colocar.');
            return;
        }

        const dinoType = selectedDino.dataset.dino-type;
        if (!isPlacementValid(enclosureName, dinoType)) {
            alert('No puedes colocar ese dinosaurio en este recinto.');
            return;
        }

        placeDino(enclosureName, dinoType);
    }

    function placeDino(enclosureName, dinoType) {
        const targetEnclosure = document.querySelector(`.zona[data-enclosure="${enclosureName}"]`);
        const newDinoElement = selectedDino.cloneNode(true);
        newDinoElement.classList.remove('selected');
        newDinoElement.classList.add('placed');
        selectedDino.remove();
        selectedDino = null;
        targetEnclosure.appendChild(newDinoElement);

        // Actualizar el estado del juego (dinos colocados)
        enclosures[enclosureName].dinos.push(dinoType);
        
        // Finalizar el turno
        endTurn();
    }

    function isPlacementValid(enclosureName, dinoType) {
        const enclosure = enclosures[enclosureName];
        if (!enclosure) return false;

        // Comprobación de reglas del dado
        if (gameData.diceRule) {
            const isRuleMet = diceRules[gameData.diceRule](enclosure);
            // El jugador que tiró el dado no tiene que seguir la regla
            const isCurrentPlayer = true; // Lógica para el jugador actual
            if (!isRuleMet && !isCurrentPlayer && enclosureName !== 'Rio') {
                return false;
            }
        }
        
        // Si no se puede colocar en otro recinto, se puede colocar en el río
        const canPlaceSomewhereElse = Object.keys(enclosures).some(name => name !== 'Rio' && isPlacementValid(name, dinoType));
        if (enclosureName === 'Rio' && canPlaceSomewhereElse) {
            return false;
        }

        // Comprobación de reglas de los recintos
        // Rivera
        if (enclosureName === 'Rivera') {
            if (enclosure.dinos.length === 0) return true;
            return enclosure.dinos[0] === dinoType;
        }
        // Campo
        if (enclosureName === 'Campo') {
            return enclosure.dinos.length < 3;
        }
        // Chelyabinsk
        if (enclosureName === 'Chelyabinsk') {
            return enclosure.dinos.length === 0;
        }
        // Moskava
        if (enclosureName === 'Moskava') {
            return !enclosure.dinos.includes(dinoType);
        }

        // Si el recinto tiene un máximo de 1 dinosaurio
        if (enclosure.maxDinos === 1 && enclosure.dinos.length === 1) {
            return false;
        }

        return true;
    }

    // Evento para lanzar el dado
    rollDiceBtn.addEventListener('click', async () => {
        try {
            const diceData = await rollDice();
            gameData.diceRule = diceData.rule;
            diceResultDisplay.textContent = `Regla del dado: ${gameData.diceRule}`;
            highlightValidEnclosures();
            alert(`Regla del turno: ${gameData.diceRule}`);
        } catch (error) {
            console.error('Error al lanzar el dado:', error);
            alert('No se pudo lanzar el dado.');
        }
    });

    function endTurn() {
        // Lógica para pasar la mano al siguiente jugador
        // Lógica para incrementar el turno
        gameData.currentTurn++;
        updateUI();

        if (gameData.currentTurn > 12) {
            calculateFinalScore();
        } else {
            // Lógica para iniciar el siguiente turno
            // Aquí se necesitaría la lógica para que el backend pase la mano al siguiente jugador
        }
    }

    // --- Puntuación final ---
    function calculateFinalScore() {
        let totalScore = 0;
        for (const name in enclosures) {
            const enclosure = enclosures[name];
            totalScore += enclosure.points(enclosure.dinos);
        }
        alert(`¡Juego terminado! Tu puntuación final es: ${totalScore}`);
    }

    initGame();
});