// Importa il nostro riferimento al gioco
import gameRef from './firebase.js';

// Importa le funzioni v9+ che ci servono
import { set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// --- Elementi del DOM ---
const startGameBtn = document.getElementById('start-game-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const resetGameBtn = document.getElementById('reset-game-btn');
const playerList = document.getElementById('player-list');
const statusDisplay = document.getElementById('game-status-display');

// Aggiungi un elemento per mostrare il timer anche nel dashboard
const timerDisplay = document.createElement('div');
timerDisplay.id = 'admin-timer-display';
timerDisplay.className = 'status-display-text';
statusDisplay.parentElement.appendChild(timerDisplay);

// --- Database Domande (COMPLETO) ---
const allQuestions = [
    { 
        text: "Quale alieno sta fingendo di essere un carlino?", 
        options: ["Frank", "Bob", "Jeff", "Nessuno"], 
        correct: "Frank" 
    },
    { 
        text: "Qual è il nome dell'arma standard MIB più piccola e potente?", 
        options: ["Noisy Cricket", "Pistolina", "Mini-Boom", "Il Grillo"], 
        correct: "Noisy Cricket" 
    },
    { 
        text: "Cosa NON devi premere?", 
        options: ["Il pulsante rosso", "Il pulsante verde", "Il pulsante blu", "Il pulsante giallo"], 
        correct: "Il pulsante rosso" 
    },
    { 
        text: "Chi è il capo dei MIB nel primo film?", 
        options: ["Agente K", "Agente J", "Agente Z", "Frank"], 
        correct: "Agente Z" 
    },
    { 
        text: "Come si chiama il dispositivo MIB usato per cancellare la memoria dei testimoni civili?", 
        options: ["Il Dimenticatore", "Il Neuralizzatore", "Il Flash-coso", "La Penna Amnesica"], 
        correct: "Il Neuralizzatore" 
    },
    { 
        text: "Nel primo film MIB, dove si trova \"La Galassia\"?", 
        options: ["Su una stella lontana", "Dentro l'auto dell'Agente K", "Sul collare di un gatto", "Sotto la sede MIB"], 
        correct: "Sul collare di un gatto" 
    },
    { 
        text: "Quale tipo di alieno è il cattivo principale (Edgar) nel primo film?", 
        options: ["Un Arquilliano", "Un Baltiano", "Uno Scarafaggio (Bug)", "Un Cefeide"], 
        correct: "Uno Scarafaggio (Bug)" 
    },
    { 
        text: "Come si chiama il gatto che indossa la Galassia?", 
        options: ["Rosario", "Orione", "Frank", "Gatto"], 
        correct: "Orione" 
    },
    { 
        text: "Chi era il partner originale dell'Agente K, che si ritira all'inizio del film?", 
        options: ["Agente D (Dee)", "Agente Z", "Agente J", "Agente M"], 
        correct: "Agente D (Dee)" 
    },
    { 
        text: "Dopo quale evento l'Agente K neuralizza un testimone dicendo \"Non è successo\"?", 
        options: ["Dopo che J fa esplodere la testa di Jeebs", "Dopo che J preme il pulsante rosso nell'auto", "Dopo che J aiuta un alieno a partorire", "Dopo aver visto Frank il carlino parlare"], 
        correct: "Dopo che J aiuta un alieno a partorire" 
    },
    { 
        text: "Di quale specie aliena sono i due \"ambasciatori\" che vengono uccisi dallo Scarafaggio all'inizio?", 
        options: ["Arquilliani", "Baltiani", "Remooliani", "Cefeidi"], 
        correct: "Arquilliani" 
    },
    { 
        text: "Quale frase famosa dice l'Agente K all'Agente J riguardo al suo nuovo abito nero?", 
        options: ["\"Non indossiamo il nero d'estate.\"", "\"La differenza tra me e te è che io lo rendo fico.\"", "\"Ora sei uno di noi.\"", "\"Sembri un becchino.\""], 
        correct: "\"La differenza tra me e te è che io lo rendo fico.\"" 
    },
    { 
        text: "Prima di unirsi ai MIB, in quale dipartimento di polizia lavorava James Edwards (Agente J)?", 
        options: ["LAPD (Los Angeles)", "NYPD (New York)", "Polizia di Chicago", "Polizia di Stato del New Jersey"], 
        correct: "NYPD (New York)" 
    }
];

// --- Stato di Gioco ---
const defaultGameState = {
    gameStatus: 'LOBBY',
    players: {},
    currentQuestion: null,
    currentQuestionIndex: null,
    remainingTime: null
};

let currentGameState = {}; 
let timerIntervalID = null;

// --- ASCOLTATORE PRINCIPALE ---
onValue(gameRef, (snapshot) => {
    const gameState = snapshot.val();
    if (gameState) {
        currentGameState = gameState;
        updateUI(gameState);
    } else {
        currentGameState = defaultGameState;
        updateUI(defaultGameState);
    }
});

// --- Funzione UI ---
function updateUI(gameState) {
    statusDisplay.textContent = gameState.gameStatus;
    
    if (gameState.remainingTime !== null && gameState.gameStatus === 'IN_GAME') {
        timerDisplay.textContent = `Tempo: ${gameState.remainingTime}s`;
    } else {
        timerDisplay.textContent = '';
    }

    playerList.innerHTML = '';
    if (!gameState.players || Object.keys(gameState.players).length === 0) {
        playerList.innerHTML = '<li class="list-group-item mib-list-item">Nessun agente in attesa...</li>';
    } else {
        const sortedPlayers = Object.values(gameState.players).sort((a, b) => (b.score || 0) - (a.score || 0));
        
        sortedPlayers.forEach(player => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center mib-list-item';
            
            const time = player.joinedAt ? new Date(player.joinedAt).toLocaleTimeString('it-IT') : 'N/A';
            const answer = player.answer ? `✔️ ${player.answer}` : '...';

            li.innerHTML = `
                <div>
                    <strong>${player.name}</strong> (P: ${player.score || 0})
                    <br>
                    <small style="color: var(--text-secondary);">Entrato: ${time}</small>
                </div>
                <span class="badge bg-primary rounded-pill" style="font-size: 0.9rem;">${answer}</span>
            `;
            playerList.appendChild(li);
        });
    }
}

// --- LOGICA DI GIOCO E TIMER ---
function startTimer() {
    if (timerIntervalID) {
        clearInterval(timerIntervalID);
    }

    let seconds = 10;
    update(gameRef, { remainingTime: seconds });

    timerIntervalID = setInterval(() => {
        seconds--;
        update(gameRef, { remainingTime: seconds });

        if (seconds <= 0) {
            clearInterval(timerIntervalID); 
            goToNextQuestion(); 
        }
    }, 1000);
}

function goToNextQuestion() {
    if (timerIntervalID) {
        clearInterval(timerIntervalID);
    }
    
    const updates = {};
    const currentIndex = currentGameState.currentQuestionIndex;

    // Calcola punteggi (solo se eravamo IN_GAME)
    if (currentGameState.gameStatus === 'IN_GAME' && currentGameState.currentQuestion) {
        const correctAnswer = currentGameState.currentQuestion.correct;
        
        if (correctAnswer && currentGameState.players) {
            for (const id in currentGameState.players) {
                const player = currentGameState.players[id];
                if (player.answer === correctAnswer) {
                    updates[`players/${id}/score`] = (player.score || 0) + 15;
                }
            }
        }
    }

    // Trova la prossima domanda
    const nextIndex = (currentIndex === null || currentIndex  === undefined) ? 0 : currentIndex + 1;

    // CONTROLLO DI SICUREZZA PER L'ERRORE
    if (nextIndex >= allQuestions.length) {
        // Gioco finito!
        updates.gameStatus = 'FINISHED';
        updates.currentQuestion = null; // Imposta a NULL, non undefined
        updates.currentQuestionIndex = null;
        updates.remainingTime = null;
        update(gameRef, updates); 
        alert("Quiz terminato!");
        return;
    }
    
    // Prepara la prossima domanda
    updates.gameStatus = 'IN_GAME';
    updates.currentQuestion = allQuestions[nextIndex]; // Ora questo è sicuro
    updates.currentQuestionIndex = nextIndex;
    
    // Resetta la risposta di tutti i giocatori
    if (currentGameState.players) {
        for (const id in currentGameState.players) {
            updates[`players/${id}/answer`] = null;
        }
    }

    update(gameRef, updates);
    startTimer();
}

// --- Pulsanti di Controllo ---
resetGameBtn.addEventListener('click', () => {
    if (confirm('Sei sicuro? Questo cancellerà tutti i giocatori e i punteggi.')) {
        clearInterval(timerIntervalID);
    
        // Usa 'set' per una sovrascrittura completa, che pulisce anche 'remainingTime', ecc.
        set(gameRef, defaultGameState); 
    }
});

startGameBtn.addEventListener('click', () => {
    goToNextQuestion(); // Avvia il gioco dalla prima domanda
});

nextQuestionBtn.addEventListener('click', () => {
    goToNextQuestion(); // Forza la domanda successiva
});