document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const agentGrid = document.getElementById('agent-grid');
    // Ottiene tutte le card degli agenti
    const agentCards = agentGrid.getElementsByClassName('agent-card');

    // Aggiunge un ascoltatore per ogni tasto premuto nella barra di ricerca
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        // Itera su ogni card
        for (let card of agentCards) {
            // Legge il nome dell'agente dal 'data-name' o dal 'h2'
            const agentName = card.dataset.name.toLowerCase() || card.querySelector('h2').textContent.toLowerCase();

            // Controlla se il nome dell'agente include il testo di ricerca
            if (agentName.includes(searchTerm)) {
                card.style.display = 'block'; // Mostra la card
            } else {
                card.style.display = 'none'; // Nasconde la card
            }
        }
    });

    console.log("Database Personale MIB caricato. Non stai vedendo nulla.");
    // --- Funzione Ora Corrente ---
    function updateTime() {
        const now = new Date();
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const timeString = now.toLocaleTimeString('en-US', options);
        document.getElementById('currentTime').textContent = timeString;
    }
    updateTime();
    setInterval(updateTime, 1000);

    // --- Animazione "Typing" Storia Operativa ---
    const historyList = document.getElementById('history-list');
    const historyItems = [
        "[CLASSIFICATO] - Incidente Zeta Reticuli",
        "[CLASSIFICATO] - Revisione Roswell",
        "[CLASSIFICATO] - Rapimento World Expo",
        "[CLASSIFICATO] - Protocollo Fuga K'tharr",
        "Errore: File 'Incidente di Parigi' non trovato."
    ];

    let delay = 1000; // 1 secondo di ritardo tra le voci

    historyItems.forEach((itemText) => {
        setTimeout(() => {
            let li = document.createElement('li');
            li.textContent = itemText;
            
            // Aggiunge un "cursore" lampeggiante alla fine
            li.style.borderRight = "3px solid var(--text-color)";
            li.style.animation = "typing 1.5s steps(30, end), blink-caret .75s step-end infinite";
            
            historyList.appendChild(li);

            // Rimuove il cursore al termine dell'animazione di battitura
            setTimeout(() => {
                li.style.borderRight = "none";
                li.style.animation = "none";
            }, 1500); // Deve corrispondere alla durata dell'animazione 'typing'

        }, delay);
        
        delay += 1800; // Aumenta il ritardo per la prossima voce (1.5s + 0.3s buffer)
    });

    // Aggiungi questo al tuo CSS (o qui, ma è meglio nel CSS):
    // @keyframes blink-caret { 
    //     from, to { border-color: transparent } 
    //     50% { border-color: var(--text-color) } 
    // }
    // (Per semplicità, l'ho aggiunto in linea sopra, ma è meglio nel CSS)


    // --- Funzione Neuralizzatore ---
    const neuralyzerButton = document.getElementById('neuralyzer-btn');
    const flashOverlay = document.getElementById('flash-overlay');
    const agentProfile = document.querySelector('.agent-profile');
    const footerText = document.getElementById('footer-text');

    neuralyzerButton.addEventListener('click', () => {
        // 1. Attiva il flash
        flashOverlay.style.opacity = '1';
        
        // 2. Rimuovi il flash rapidamente
        setTimeout(() => {
            flashOverlay.style.opacity = '0';
        }, 150); // Flash rapido

        // 3. Modifica la pagina dopo il flash
        setTimeout(() => {
            // Sostituisci il profilo dell'agente
            agentProfile.innerHTML = `
                <div class="profile-header">
                    <h2>ACCESSO NEGATO</h2>
                </div>
                <div style="padding: 20px; text-align: center;">
                    <p style="font-size: 1.2em; color: var(--warning-color);">Memoria della sessione terminata.</p>
                    <p>Non hai visto nulla. Questo era solo un test del tuo schermo.</p>
                    <p>Per favore, torna a guardare video di gattini.</p>
                </div>
            `;
            
            // Nascondi gli altri pannelli
            document.querySelector('.equipment-inventory').style.display = 'none';
            document.querySelector('.operational-history').style.display = 'none';
            
            // Modifica il footer
            footerText.textContent = "GRAZIE PER LA COLLABORAZIONE.";
            neuralyzerButton.style.display = 'none'; // Nascondi il pulsante
            document.querySelector('.security-status').style.display = 'none';

        }, 200); // Avviene subito dopo il flash
    });


    console.log("MIB Terminal v2.0 online. Accesso ai dati dell'agente... Attenzione ai glitch.");
});