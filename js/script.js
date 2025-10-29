document.addEventListener('DOMContentLoaded', () => {
  
    // --- Sezione 2: Ora Corrente (Solo per la pagina Dossier) ---
    const currentTimeEl = document.getElementById('currentTime');

    // CONTROLLO: Esegui solo se l'elemento dell'orologio esiste
    if (currentTimeEl) {
        function updateTime() {
            const now = new Date();
            const options = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            const timeString = now.toLocaleTimeString('it-IT', options); // Usiamo 'it-IT'
            currentTimeEl.textContent = timeString;
        }
        updateTime();
        setInterval(updateTime, 1000);
    }

    // --- Sezione 3: Animazione "Typing" (Solo per la pagina Dossier) ---
    const historyList = document.getElementById('history-list');

    // CONTROLLO: Esegui solo se la lista della cronologia esiste
 if (historyList) {
        const historyItems = [
            "[CLASSIFICATO] - Incidente Zeta Reticuli",
            "Anomalia temporale: Times Square, 1977",
            "[CLASSIFICATO] - Revisione Roswell",
            "Contenimento: Fuga zoo acquatico, Livello 4",
            "File danneggiato: 004-Xylos",
            "[CLASSIFICATO] - Rapimento World Expo",
            "Protocollo 'Gatto Gigante': ESEGUITO",
            "[CLASSIFICATO] - Protocollo Fuga K'tharr",
            "Neuralizzazione: Concerto rock (di massa)",
            "Errore: File 'Incidente di Parigi' non trovato.",
            "Ricalibrazione: Rete di teletrasporto sotterranea",
            "[CLASSIFICATO] - Affare 'Biscotto della Fortuna'",
            "Contatto diplomatico: Ambasciata Arquilliana",
            "Pulizia: Infiltrazione Centauriana, Settore 7G",
            "File illeggibile: [DATI CANCELLATI]",
            "[CLASSIFICATO] - Quarantena 'Grande Mela'",
            "Fallimento negoziazione: Baltiano (Testa a fagiolo)",
            "Errore di sistema: Neuralizzatore bloccato",
            "Monitoraggio: Attività sismica sub-oceanica",
            "[CLASSIFICATO] - Il 'Mistero' del Triangolo delle Bermuda",
            "Aggiornamento software: Noisy Cricket v2.5",
            "Rilevamento: Parassita Jatraviano",
            "Errore: Accesso negato (Livello 9 richiesto)",
            "[CLASSIFICATO] - Operazione 'Elvis'",
            "Chiusura portale: Antartide, Stazione 3",
            "Archiviazione: Tecnologia 'Verme Palla'",
            "Neuralizzazione: Intero cast di 'Cats'",
            "[CLASSIFICATO] - La sparizione dell'Agente D"
        ];

        // --- NUOVA LOGICA ---
        // 1. Mischia l'array e seleziona i primi 5 elementi
        const randomItems = historyItems
                                .sort(() => 0.5 - Math.random()) // Mischia l'array
                                .slice(0, 5);                   // Prende solo i primi 5

        let delay = 1000;

        // 2. Itera solo sull'array `randomItems` (che ne ha 5)
        randomItems.forEach((itemText) => {
            setTimeout(() => {
                let li = document.createElement('li');
                // IMPORTANTE: Aggiungi la classe Bootstrap!
                li.className = "list-group-item"; 
                li.textContent = itemText;
                
                li.style.borderRight = "3px solid var(--text-color)";
                li.style.animation = "typing 1.5s steps(30, end), blink-caret .75s step-end infinite";
                
                historyList.appendChild(li);

                setTimeout(() => {
                    li.style.borderRight = "none";
                    li.style.animation = "none";
                }, 1500);

            }, delay);
            
            delay += 1900; // Il ritardo tra le voci rimane invariato
        });
    }


    // --- Sezione 4: Funzione Neuralizzatore (Solo per la pagina Dossier) ---
    const neuralyzerButton = document.getElementById('neuralyzer-btn');

    // CONTROLLO: Esegui solo se il pulsante neuralizzatore esiste
    if (neuralyzerButton) {
        const flashOverlay = document.getElementById('flash-overlay');
        const agentProfile = document.querySelector('.agent-profile');
        const footerText = document.getElementById('footer-text');

        neuralyzerButton.addEventListener('click', () => {
            flashOverlay.style.opacity = '1';
            
            setTimeout(() => {
                flashOverlay.style.opacity = '0';
            }, 150);

            setTimeout(() => {
                // Sostituisci il profilo dell'agente (già una card Bootstrap)
                agentProfile.innerHTML = `
                    <div class="card-header">
                        <h2 class="h4 mb-0">ACCESSO NEGATO</h2>
                    </div>
                    <div class="card-body" style="text-align: center;">
                        <p class="fs-5" style="color: var(--warning-color);">Memoria della sessione terminata.</p>
                        <p>Non hai visto nulla. Questo era solo un test del tuo schermo.</p>
                        <p>Per favore, torna a guardare video di gattini.</p>
                    </div>
                `;
                
                // Nascondi gli altri pannelli
                const inventory = document.querySelector('.equipment-inventory');
                if (inventory) inventory.style.display = 'none';
                
                const history = document.querySelector('.operational-history');
                if (history) history.style.display = 'none';
                
                // Modifica il footer
                footerText.textContent = "GRAZIE PER LA COLLABORAZIONE.";
                neuralyzerButton.style.display = 'none';
                
                const securityStatus = document.querySelector('.security-status');
                if (securityStatus) securityStatus.style.display = 'none';

            }, 200);
        });
    }

    console.log("MIB Terminal v2.0 online. Accesso ai dati... Tutto sotto controllo.");
});