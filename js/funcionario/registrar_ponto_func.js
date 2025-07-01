import { auth, db } from './../../firebase/firebaseConfig.js';
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  collection, addDoc, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const relogioEl = document.getElementById('relogio');
const btnRegistrar = document.getElementById('btnRegistrar');
const listaRegistros = document.getElementById('listaRegistros');

let userLogado = null;

setInterval(() => {
  const agora = new Date();
  relogioEl.textContent = agora.toLocaleTimeString();
}, 1000);

onAuthStateChanged(auth, user => {
  if (user) {
    userLogado = user;
    carregarRegistros(user.uid);
  } else {
    alert("Você precisa estar logado para registrar ponto.");
    window.location.href = "./../../index.html";
  }
});

async function carregarRegistros(uid) {
  listaRegistros.innerHTML = '';
  const q = query(collection(db, "registros_ponto"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(doc => {
    const dados = doc.data();
    const li = document.createElement('li');
    li.textContent = `${dados.tipo} - ${dados.horario} (${dados.data})`;
    listaRegistros.appendChild(li);
  });
}

btnRegistrar.addEventListener('click', async () => {
  if (!userLogado) return;

  const agora = new Date();
  const horario = agora.toLocaleTimeString();
  const data = agora.toLocaleDateString();
  const tipo = await definirTipoRegistro(userLogado.uid, data);

  try {
    await addDoc(collection(db, "registros_ponto"), {
      uid: userLogado.uid,
      horario,
      data,
      tipo
    });

    const li = document.createElement('li');
    li.textContent = `${tipo} - ${horario} (${data})`;
    listaRegistros.appendChild(li);
    alert(`Ponto de ${tipo} registrado com sucesso!`);
  } catch (error) {
    console.error("Erro ao registrar ponto:", error);
    alert("Erro ao registrar ponto.");
  }
});

async function definirTipoRegistro(uid, dataHoje) {
  const q = query(collection(db, "registros_ponto"),
                  where("uid", "==", uid),
                  where("data", "==", dataHoje));
  const snapshot = await getDocs(q);
  const count = snapshot.size;
  return count % 2 === 0 ? 'Entrada' : 'Saída';
}
