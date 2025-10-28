const startGameBtn = document.getElementById('start-game-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const resetGameBtn = document.getElementById('reset-game-btn');
const playerList = document.getElementById('player-list');
const statusDisplay = document.getElementById('game-status-display');

// Inizializza lo stato se è la prima volta
initState();

// Sim-database delle domande
const allQuestions = [
    { text: "Quale alieno sta fingendo di essere un carlino?", options: ["Frank", "Bob", "Jeff", "Nessuno"] },
    { text: "Qual è il nome dell'arma standard MIB più piccola e potente?", options: ["Noisy Cricket", "Pistolina", "Mini-Boom", "Il Grillo"] },
    { text: "Cosa NON devi premere?", options: ["Il pulsante rosso", "Il pulsante verde", "Il pulsante blu"] }
];
let questionIndex = 0;


// Pulsante RESET
resetGameBtn.addEventListener('click', () => {
    if (confirm('Sei sicuro? Questo cancellerà tutti i giocatori e i punteggi.')) {
        questionIndex = 0;
        resetState(); // Importa da game-state.js
        updateUI(getState());
    }
});

// Pulsante AVVIA GIOCO
startGameBtn.addEventListener('click', () => {
    const currentState = getState();
    currentState.gameStatus = 'IN_GAME';
    currentState.currentQuestion = allQuestions[questionIndex];
    setState(currentState); // Questo avvisa tutti gli altri!
});

// Pulsante PROSSIMA DOMANDA
nextQuestionBtn.addEventListener('click', () => {
    questionIndex++;
    if (questionIndex >= allQuestions.length) {
        questionIndex = 0; // Ricomincia
    }
    
    const currentState = getState();
    currentState.gameStatus = 'IN_GAME'; // Assicurati sia in gioco
    currentState.currentQuestion = allQuestions[questionIndex];
    
    // Resetta le risposte dei giocatori per la nuova domanda
    for (const id in currentState.players) {
        currentState.players[id].answer = null;
    }
    
    setState(currentState);
});


// Funzione per aggiornare la UI della Dashboard
function updateUI(gameState) {
    statusDisplay.textContent = gameState.gameStatus;
    
    playerList.innerHTML = ''; // Pulisci la lista
    if (Object.keys(gameState.players).length === 0) {
        playerList.innerHTML = '<li>Nessun agente in attesa...</li>';
    } else {
        for (const id in gameState.players) {
            const player = gameState.players[id];
            const li = document.createElement('li');
            li.textContent = `${player.name} (Punteggio: ${player.score}) - Risposta: ${player.answer || 'N/A'}`;
            playerList.appendChild(li);
        }
    }
}

// L'ASCOLTATORE: Reagisce ai giocatori che si uniscono/rispondono
window.addEventListener('storage', (event) => {
    if (event.key === GAME_STATE_KEY) {
        console.log("Stato aggiornato da un giocatore!");
        updateUI(getState());
    }
});

// Aggiorna la UI al caricamento
updateUI(getState());