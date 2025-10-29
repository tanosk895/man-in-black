// Importa il nostro riferimento al gioco
import gameRef from './firebase.js';

// Importa le funzioni v9+ che ci servono
import { set, onValue, child, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js"; 
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
    answer: null,
    joinedAt: serverTimestamp() 
  });
});
// --- Funzione UI (CORRETTA) ---
function updateUI(gameState) {
    
    // Trova l'elemento timer (lo cerchiamo sempre, lo mostriamo/nascondiamo con il div genitore)
    const playerTimer = document.getElementById('player-timer');
    if (playerTimer && gameState.remainingTime !== null) {
        playerTimer.textContent = gameState.remainingTime;
    }

    if (!myPlayerID || !gameState.players || !gameState.players[myPlayerID]) {
        // Schermata Join
        joinScreen.classList.remove('hidden');
        waitingScreen.classList.add('hidden');
        gameScreen.classList.add('hidden');
        postAnswerScreen.classList.add('hidden');
    } else {
        // Giocatore loggato
        joinScreen.classList.add('hidden');
        document.getElementById('welcome-message').textContent = `Ciao, Agente ${gameState.players[myPlayerID].name}`;
        document.getElementById('player-id-display').textContent = myPlayerID;

        if (gameState.gameStatus === 'IN_GAME' && gameState.currentQuestion) {
            if (gameState.players[myPlayerID].answer) {
                // Ha risposto, mostra schermata post-risposta
                waitingScreen.classList.add('hidden');
                gameScreen.classList.add('hidden');
                postAnswerScreen.classList.remove('hidden');
            } else {
                // Non ha risposto, mostra la domanda
                waitingScreen.classList.add('hidden');
                gameScreen.classList.remove('hidden');
                postAnswerScreen.classList.add('hidden');
                
                playerQuestionText.textContent = gameState.currentQuestion.text; 
                
                const optionsContainer = document.getElementById('answer-options');
                optionsContainer.innerHTML = '';
                
                if (gameState.currentQuestion.options) {
                    gameState.currentQuestion.options.forEach(option => {
                        const btn = document.createElement('button');
                        btn.className = 'btn answer-btn w-100'; 
                        btn.textContent = option;
                        btn.onclick = () => submitAnswer(option);
                        
                        const colWrapper = document.createElement('div');
                        colWrapper.className = 'col';
                        colWrapper.appendChild(btn);
                        optionsContainer.appendChild(colWrapper);
                    });
                }
            }
        } else {
            // Non in gioco (Lobby o Fine), mostra schermata di attesa
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