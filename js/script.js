document.addEventListener("DOMContentLoaded", () => {
  // Funzione per aggiornare l'ora corrente
  function updateTime() {
    const now = new Date();
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    const timeString = now.toLocaleTimeString("en-US", options);
    document.getElementById("currentTime").textContent = timeString;
  }

  // Aggiorna l'ora immediatamente e poi ogni secondo
  updateTime();
  setInterval(updateTime, 1000);

  // Effetto "glitch" per il testo in stile MIB (opzionale, più avanzato)
  // Qui potresti aggiungere JS più complesso per effetti visivi o interattivi.
  // Per ora, concentriamoci sulla base.

  console.log("MIB Terminal online. Accesso ai dati dell'agente.");
});
