// Importa il nostro riferimento al gioco
import gameRef from './firebase.js';

// Importa le funzioni v9+ che ci servono
import { onValue } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// --- Elementi del DOM ---
const lobbyScreen = document.getElementById('display-lobby');
const questionScreen = document.getElementById('display-question');
const scoresScreen = document.getElementById('display-scores');
const lobbyPlayerList = document.getElementById('lobby-player-list');
const questionText = document.getElementById('question-text');
const playerAnswersDisplay = document.getElementById('player-answers-display');

// --- Stato di Default ---
const defaultGameState = {
    gameStatus: 'LOBBY',
    players: {},
    currentQuestion: null
};

function updateUI(gameState) {
    lobbyPlayerList.innerHTML = '';
    if (gameState.players) {
        for (const id in gameState.players) {
            const player = gameState.players[id];
            const li = document.createElement('li');
            li.textContent = player.name;
            lobbyPlayerList.appendChild(li);
        }
    }

    if (gameState.gameStatus === 'LOBBY') {
        lobbyScreen.classList.remove('hidden');
        questionScreen.classList.add('hidden');
        scoresScreen.classList.add('hidden');
    } 
    else if (gameState.gameStatus === 'IN_GAME' && gameState.currentQuestion) {
        lobbyScreen.classList.add('hidden');
        questionScreen.classList.remove('hidden');
        scoresScreen.classList.add('hidden');

        questionText.textContent = gameState.currentQuestion.text;
        
        playerAnswersDisplay.innerHTML = '';
        if (gameState.players) {
            for (const id in gameState.players) {
                const player = gameState.players[id];
                const span = document.createElement('span');
                span.className = 'player-status-bubble';
                if (player.answer) {
                    span.classList.add('answered');
                }
                span.textContent = player.name.charAt(0);
                playerAnswersDisplay.appendChild(span);
            }
        }
    }
    else if (gameState.gameStatus === 'SCORES') {
        lobbyScreen.classList.add('hidden');
        questionScreen.classList.add('hidden');
        scoresScreen.classList.remove('hidden');
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