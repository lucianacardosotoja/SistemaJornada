import { db } from './../../firebase/firebaseConfig.js';
import {
  collection, query, where, getDocs, doc,
  updateDoc, deleteDoc, addDoc, getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const emailInput = document.getElementById("email");
const dataInput = document.getElementById("data");
const buscarBtn = document.getElementById("buscar");
const adicionarBtn = document.getElementById("adicionar");
const registrosList = document.getElementById("registros");
const mensagemDiv = document.getElementById("mensagem");

let currentUID = null;
let currentData = null;

function mostrarMensagem(texto, erro = false) {
  mensagemDiv.textContent = texto;
  mensagemDiv.style.color = erro ? "red" : "green";
}


function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

buscarBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const data = dataInput.value;
  registrosList.innerHTML = "";
  mostrarMensagem("");

  if (!email || !data) {
    mostrarMensagem("Informe o email e a data.", true);
    return;
  }

  currentData = formatarData(data);

  try {
    const funcionariosRef = collection(db, "funcionario");
    const funcQuery = query(funcionariosRef, where("email", "==", email));
    const funcSnapshot = await getDocs(funcQuery);

    if (funcSnapshot.empty) {
      mostrarMensagem("Funcionário não encontrado.", true);
      currentUID = null;
      return;
    }

    currentUID = funcSnapshot.docs[0].id;
    carregarRegistros();
  } catch (error) {
    console.error("Erro ao buscar funcionário:", error);
    mostrarMensagem("Erro ao buscar funcionário.", true);
  }
});

async function carregarRegistros() {
  registrosList.innerHTML = "";
  if (!currentUID || !currentData) return;

  try {
    const pontoRef = collection(db, "registros_ponto");
    const pontoQuery = query(pontoRef,
      where("uid", "==", currentUID),
      where("data", "==", currentData)
    );
    const snapshot = await getDocs(pontoQuery);

    if (snapshot.empty) {
      registrosList.innerHTML = "<li>Nenhum registro encontrado.</li>";
      return;
    }

    snapshot.forEach(docSnap => {
      const reg = docSnap.data();
      const li = document.createElement("li");
      li.style.marginBottom = "12px";

      const tipoLabel = document.createElement("strong");
      tipoLabel.textContent = reg.tipo + ": ";

      const inputHora = document.createElement("input");
      inputHora.type = "time";
      inputHora.value = reg.horario.substring(0, 5);
      inputHora.style.marginRight = "8px";

      const btnSalvar = document.createElement("button");
      btnSalvar.textContent = "Salvar";
      btnSalvar.style.marginRight = "6px";
      btnSalvar.onclick = async () => {
        if (!inputHora.value) {
          mostrarMensagem("Informe um horário válido.", true);
          return;
        }
        try {
          await updateDoc(doc(db, "registros_ponto", docSnap.id), {
            horario: inputHora.value + ":00"
          });
          mostrarMensagem("Horário atualizado.");
          carregarRegistros();
        } catch (error) {
          console.error("Erro ao atualizar horário:", error);
          mostrarMensagem("Erro ao atualizar horário.", true);
        }
      };

      const btnRemover = document.createElement("button");
      btnRemover.textContent = "Remover";
      btnRemover.onclick = async () => {
        if (confirm("Deseja realmente remover este registro?")) {
          try {
            await deleteDoc(doc(db, "registros_ponto", docSnap.id));
            mostrarMensagem("Registro removido.");
            carregarRegistros();
          } catch (error) {
            console.error("Erro ao remover registro:", error);
            mostrarMensagem("Erro ao remover registro.", true);
          }
        }
      };

      li.appendChild(tipoLabel);
      li.appendChild(inputHora);
      li.appendChild(btnSalvar);
      li.appendChild(btnRemover);

      registrosList.appendChild(li);
    });

  } catch (error) {
    console.error("Erro ao carregar registros:", error);
    mostrarMensagem("Erro ao carregar registros.", true);
  }
}

adicionarBtn.addEventListener("click", async () => {
  const tipo = document.getElementById("novoTipo").value;
  const horario = document.getElementById("novoHorario").value;

  if (!currentUID || !currentData) {
    mostrarMensagem("Busque um funcionário antes de adicionar.", true);
    return;
  }

  if (!tipo || !horario) {
    mostrarMensagem("Preencha tipo e horário.", true);
    return;
  }

  const registro = {
    uid: currentUID,
    data: currentData,
    tipo,
    horario: horario + ":00"
  };

  try {
    await addDoc(collection(db, "registros_ponto"), registro);
    mostrarMensagem("Registro adicionado.");
    document.getElementById("novoTipo").value = "";
    document.getElementById("novoHorario").value = "";
    carregarRegistros();
  } catch (error) {
    console.error("Erro ao adicionar registro:", error);
    mostrarMensagem("Erro ao adicionar registro.", true);
  }
});
