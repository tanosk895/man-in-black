// Importa il nostro riferimento al gioco
import gameRef from './firebase.js';

// Importa le funzioni v9+ che ci servono
import { set, onValue, child } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// --- Stato Locale ---
let myPlayerID = localStorage.getItem('mibPlayerID');

// --- Elementi del DOM ---
const joinScreen = document.getElementById('join-screen');
const waitingScreen = document.getElementById('waiting-screen');
const gameScreen = document.getElementById('game-screen');
const postAnswerScreen = document.getElementById('post-answer-screen');
const playerQuestionText = document.getElementById('player-question-text');
const nameInput = document.getElementById('name-input');
const joinBtn = document.getElementById('join-btn');

// --- Stato di Default ---
const defaultGameState = {
    gameStatus: 'LOBBY',
    players: {},
    currentQuestion: null
};

// --- Funzioni Helper ---
function generateID() {
    return 'pid-' + Math.random().toString(36).substr(2, 9);
}

// --- Logica di Join (Sintassi v9+) ---
joinBtn.addEventListener('click', () => {
    if (!myPlayerID) {
        myPlayerID = generateID();
        localStorage.setItem('mibPlayerID', myPlayerID);
    }
    
    // v9: child(riferimento, percorso)
    const playerRef = child(gameRef, 'players/' + myPlayerID);
    
    // v9: set(riferimento, valore)
    set(playerRef, {
        name: nameInput.value || 'Recluta',
        score: 0,
        answer: null
    });
});

// --- Funzione UI (CORRETTA) ---
function updateUI(gameState) {
    if (!myPlayerID || !gameState.players || !gameState.players[myPlayerID]) {
        joinScreen.classList.remove('hidden');
        waitingScreen.classList.add('hidden');
        gameScreen.classList.add('hidden');
        postAnswerScreen.classList.add('hidden');
    } else {
        joinScreen.classList.add('hidden');
        document.getElementById('welcome-message').textContent = `Ciao, Agente ${gameState.players[myPlayerID].name}`;
        document.getElementById('player-id-display').textContent = myPlayerID;

        if (gameState.gameStatus === 'IN_GAME' && gameState.currentQuestion) {
            if (gameState.players[myPlayerID].answer) {
                waitingScreen.classList.add('hidden');
                gameScreen.classList.add('hidden');
                postAnswerScreen.classList.remove('hidden');
            } else {
                waitingScreen.classList.add('hidden');
                gameScreen.classList.remove('hidden');
                postAnswerScreen.classList.add('hidden');
                
                playerQuestionText.textContent = gameState.currentQuestion.text; 
                
                const optionsContainer = document.getElementById('answer-options');
                optionsContainer.innerHTML = '';
                
                if (gameState.currentQuestion.options) {
                    
                    // --- INIZIO BLOCCO MODIFICATO ---
                    
                    gameState.currentQuestion.options.forEach(option => {
                        // 1. Crea il bottone
                        const btn = document.createElement('button');
                        
                        // 2. Aggiungi le classi Bootstrap + la nostra classe custom
                        btn.className = 'btn answer-btn w-100'; 
                        
                        btn.textContent = option;
                        btn.onclick = () => submitAnswer(option);
                        
                        // 3. Crea il wrapper della colonna Bootstrap
                        const colWrapper = document.createElement('div');
                        colWrapper.className = 'col';
                        
                        // 4. Inserisci il bottone dentro la colonna
                        colWrapper.appendChild(btn);
                        
                        // 5. Aggiungi la colonna (con dentro il bottone) al container
                        optionsContainer.appendChild(colWrapper);
                    });

                    // --- FINE BLOCCO MODIFICATO ---
                }
            }
        } else {
            waitingScreen.classList.remove('hidden');
            gameScreen.classList.add('hidden');
            postAnswerScreen.classList.add('hidden');
        }
    }
}

// --- Funzione Risposta (Sintassi v9+) ---
function submitAnswer(answer) {
    if (myPlayerID) {
        // v9: crea un riferimento alla *sola* risposta e aggiornala
        const answerRef = child(gameRef, 'players/' + myPlayerID + '/answer');
        set(answerRef, answer);
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