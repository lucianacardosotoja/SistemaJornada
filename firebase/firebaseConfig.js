import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig =  {
    apiKey: "SUA_CHAVE",
    authDomain: "SEU_DOMINIO",
    projectId: "SEU_PROJETO_ID",
    storageBucket: "SEU_BUCKET",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SUA_APP_ID"
    };
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);    
const db = getFirestore(app);

export { app, auth, db };