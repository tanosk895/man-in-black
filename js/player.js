// Il nostro ID giocatore
let myPlayerID = localStorage.getItem('mibPlayerID');

// --- Elementi del DOM ---
const joinScreen = document.getElementById('join-screen');
const waitingScreen = document.getElementById('waiting-screen');
const gameScreen = document.getElementById('game-screen');
const postAnswerScreen = document.getElementById('post-answer-screen'); // <-- NUOVO
const playerQuestionText = document.getElementById('player-question-text'); // <-- NUOVO

const nameInput = document.getElementById('name-input');
const joinBtn = document.getElementById('join-btn');

// Funzione per generare un ID unico
function generateID() {
    return 'pid-' + Math.random().toString(36).substr(2, 9);
}

// --- Logica di Join ---
joinBtn.addEventListener('click', () => {
    if (!myPlayerID) {
        myPlayerID = generateID();
        localStorage.setItem('mibPlayerID', myPlayerID); // Salva il nostro ID
    }
    
    const currentState = getState();
    currentState.players[myPlayerID] = {
        name: nameInput.value || 'Recluta',
        score: 0,
        answer: null
    };
    
    // Scriviamo il nuovo stato, questo allerterà la Dashboard e il Display
    setState(currentState);
    
    updateUI(currentState);
});

// --- Funzione UI Principale (MODIFICATA) ---
function updateUI(gameState) {
    if (!myPlayerID || !gameState.players[myPlayerID]) {
        // 1. Non siamo ancora in gioco -> Mostra Schermata JOIN
        joinScreen.classList.remove('hidden');
        waitingScreen.classList.add('hidden');
        gameScreen.classList.add('hidden');
        postAnswerScreen.classList.add('hidden');
    } else {
        // Siamo in gioco
        joinScreen.classList.add('hidden');
        document.getElementById('welcome-message').textContent = `Ciao, Agente ${gameState.players[myPlayerID].name}`;
        document.getElementById('player-id-display').textContent = myPlayerID;

        // 2. Il gioco è attivo?
        if (gameState.gameStatus === 'IN_GAME' && gameState.currentQuestion) {
            
            // 3. Abbiamo già risposto?
            if (gameState.players[myPlayerID].answer) {
                // Sì -> Mostra Schermata ATTESA SIMPATICA
                waitingScreen.classList.add('hidden');
                gameScreen.classList.add('hidden');
                postAnswerScreen.classList.remove('hidden'); // REQ 2
            } else {
                // No -> Mostra Schermata DOMANDA
                waitingScreen.classList.add('hidden');
                gameScreen.classList.remove('hidden');
                postAnswerScreen.classList.add('hidden');
                
                // REQ 1: Popola il testo della domanda
                playerQuestionText.textContent = gameState.currentQuestion.text; 
                
                // Popola le opzioni di risposta
                const optionsContainer = document.getElementById('answer-options');
                optionsContainer.innerHTML = ''; // Pulisci
                
                gameState.currentQuestion.options.forEach(option => {
                    const btn = document.createElement('button');
                    btn.className = 'answer-btn';
                    btn.textContent = option;
                    btn.onclick = () => submitAnswer(option);
                    optionsContainer.appendChild(btn);
                });
            }

        } else {
            // 4. Siamo in LOBBY o SCORES -> Mostra Schermata ATTESA NORMALE
            waitingScreen.classList.remove('hidden');
            gameScreen.classList.add('hidden');
            postAnswerScreen.classList.add('hidden');
        }
    }
}

// --- Funzione per inviare una risposta ---
function submitAnswer(answer) {
    const currentState = getState();
    if (currentState.players[myPlayerID]) {
        currentState.players[myPlayerID].answer = answer;
        setState(currentState); // Invia la nostra risposta
    }
    // Aggiorna immediatamente la UI
    // La funzione updateUI vedrà che abbiamo risposto e mostrerà la schermata di attesa.
    updateUI(getState());
}

// L'ASCOLTATORE: Reagisce ai cambiamenti fatti da ALTRE finestre
window.addEventListener('storage', (event) => {
    if (event.key === GAME_STATE_KEY) {
        console.log("Stato aggiornato dal QG!");
        updateUI(getState());
    }
});

// Aggiorna la UI al caricamento della pagina
updateUI(getState());