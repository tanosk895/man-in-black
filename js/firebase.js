// Importa le funzioni v9+ necessarie dagli URL CDN di Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, child } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
// La tua configurazione (le chiavi sono pubbliche, ricorda di proteggere le REGOLE)
const firebaseConfig = {
  apiKey: "AIzaSyBxAxMrVawOMLCnOgVCMgLorLWQLIqcOoI",
  authDomain: "main-in-black.firebaseapp.com",
  databaseURL: "https://main-in-black-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "main-in-black",
  storageBucket: "main-in-black.firebasestorage.app",
  messagingSenderId: "918048462195",
  appId: "1:918048462195:web:a7aad855107d0ae66ce106",
  measurementId: "G-R6WN7D797M"
};

// Inizializza l'app
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);

// Crea un riferimento al "cervello" del nostro gioco
// 'ref' è una funzione che prende il database e un percorso
const gameRef = child(dbRef, 'mibGame'); 
// Esporta il riferimento per gli altri file
export default gameRef;

