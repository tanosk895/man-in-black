// La chiave per il nostro "database" in localStorage
const GAME_STATE_KEY = 'mibGameState';

// Lo stato iniziale/predefinito del gioco
const defaultGameState = {
    gameStatus: 'LOBBY', // LOBBY, IN_GAME, SCORES
    players: {}, // es: { "id-123": { name: "Agente K", score: 0, answer: null } }
    currentQuestion: null
};

function initState() {
    if (!localStorage.getItem(GAME_STATE_KEY)) {
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(defaultGameState));
    }
}

function resetState() {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(defaultGameState));
    console.log('STATO RESETTATO');
}

function getState() {
    try {
        const stateStr = localStorage.getItem(GAME_STATE_KEY);
        if (stateStr) {
            return JSON.parse(stateStr);
        } else {
            return defaultGameState;
        }
    } catch (e) {
        console.error("Errore nel parsing dello stato:", e);
        return defaultGameState;
    }
}

function setState(newState) {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(newState));
}