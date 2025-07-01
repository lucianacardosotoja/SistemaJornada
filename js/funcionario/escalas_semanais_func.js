import { auth, db } from './../../firebase/firebaseConfig.js';
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  doc, getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const escalaLista = document.getElementById('escala-lista');

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const docRef = doc(db, "escalas", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const dados = docSnap.data();
      mostrarEscala(dados);
    } else {
      escalaLista.innerHTML = "<li>Escala não encontrada para este usuário.</li>";
    }
  } else {
    alert("Você precisa estar logado para ver sua escala.");
    window.location.href = "./../../index.html";
  }
});

function mostrarEscala(escala) {
  const dias = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];
  escalaLista.innerHTML = "";
  dias.forEach(dia => {
    const horario = escala[dia] || "Sem informação";
    const li = document.createElement("li");
    li.textContent = `${dia.charAt(0).toUpperCase() + dia.slice(1)}: ${horario}`;
    escalaLista.appendChild(li);
  });
}
