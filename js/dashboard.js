// Importa il nostro riferimento al gioco
import gameRef from './firebase.js';

// Importa le funzioni v9+ che ci servono
import { set, onValue, get } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// --- Elementi del DOM ---
const startGameBtn = document.getElementById('start-game-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const resetGameBtn = document.getElementById('reset-game-btn');
const playerList = document.getElementById('player-list');
const statusDisplay = document.getElementById('game-status-display');

// --- Stato di Default ---
const defaultGameState = {
    gameStatus: 'LOBBY',
    players: {},
    currentQuestion: null
};

// --- Database Domande ---
const allQuestions = [
    { text: "Quale alieno sta fingendo di essere un carlino?", options: ["Frank", "Bob", "Jeff", "Nessuno"], correct: "Frank" },
    { text: "Qual è il nome dell'arma standard MIB più piccola e potente?", options: ["Noisy Cricket", "Pistolina", "Mini-Boom", "Il Grillo"], correct: "Noisy Cricket" },
    { text: "Cosa NON devi premere?", options: ["Il pulsante rosso", "Il pulsante verde", "Il pulsante blu"], correct: "Il pulsante rosso" }
];
let questionIndex = 0;


// --- Pulsanti di Controllo (Sintassi v9+) ---

// Pulsante RESET
resetGameBtn.addEventListener('click', () => {
    if (confirm('Sei sicuro? Questo cancellerà tutti i giocatori e i punteggi.')) {
        questionIndex = 0;
        // v9: set(riferimento, valore)
        set(gameRef, defaultGameState);
    }
});

// Pulsante AVVIA GIOCO
startGameBtn.addEventListener('click', () => {
    // v9: get(riferimento) è il nuovo 'once' e ritorna una Promise
    get(gameRef).then((snapshot) => {
        const currentState = snapshot.val() || defaultGameState;
        
        currentState.gameStatus = 'IN_GAME';
        currentState.currentQuestion = allQuestions[questionIndex]; // questionIndex è 0
        
        if (currentState.players) {
            for (const id in currentState.players) {
                currentState.players[id].answer = null;
            }
        }
        set(gameRef, currentState);
    });
});

// Pulsante PROSSIMA DOMANDA
nextQuestionBtn.addEventListener('click', () => {
    get(gameRef).then((snapshot) => {
        const currentState = snapshot.val() || defaultGameState;

        // Logica punteggio
        if (currentState.gameStatus === 'IN_GAME' && currentState.currentQuestion) {
            const previousQuestion = allQuestions.find(q => q.text === currentState.currentQuestion.text);
            const correctAnswer = previousQuestion?.correct;

            if (correctAnswer && currentState.players) {
                for (const id in currentState.players) {
                    const player = currentState.players[id];
                    if (player.answer === correctAnswer) {
                        player.score = (player.score || 0) + 15;
                    }
                }
            }
        }
        
        // Prepara prossima domanda
        questionIndex++;
        if (questionIndex >= allQuestions.length) {
            questionIndex = 0; // Ricomincia
        }
        
        currentState.gameStatus = 'IN_GAME';
        currentState.currentQuestion = allQuestions[questionIndex];
        
        if (currentState.players) {
            for (const id in currentState.players) {
                currentState.players[id].answer = null;
            }
        }
        
        set(gameRef, currentState);
    });
});


// --- Funzione UI (Invariata) ---
function updateUI(gameState) {
    statusDisplay.textContent = gameState.gameStatus;
    playerList.innerHTML = '';
    
    if (!gameState.players || Object.keys(gameState.players).length === 0) {
        playerList.innerHTML = '<li>Nessun agente in attesa...</li>';
    } else {
        for (const id in gameState.players) {
            const player = gameState.players[id];
            const li = document.createElement('li');
            li.textContent = `${player.name} (Punteggio: ${player.score || 0}) - Risposta: ${player.answer || 'N/A'}`;
            playerList.appendChild(li);
        }
    }
}

// --- ASCOLTATORE FIREBASE (Sintassi v9+) ---
// v9: onValue(riferimento, callback)
onValue(gameRef, (snapshot) => {
    const gameState = snapshot.val();
    if (gameState) {
        updateUI(gameState);
    } else {
        updateUI(defaultGameState);
    }
});

// --- Inizializzazione ---
get(gameRef).then((snapshot) => {
    if (!snapshot.exists()) {
        set(gameRef, defaultGameState);
    }
});