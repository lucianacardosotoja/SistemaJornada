import { db } from './../../firebase/firebaseConfig.js';
import {
  collection, getDocs, addDoc, deleteDoc, updateDoc, doc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const input = document.getElementById("mesano");
const btn = document.getElementById("btnGerar");
const calendarioDiv = document.getElementById("calendario");
const mensagemDiv = document.getElementById("mensagem");

const modal = document.getElementById("modalEscala");
const modalTitulo = document.getElementById("modalTitulo");
const funcionarioNome = document.getElementById("funcionarioNome");
const periodo = document.getElementById("periodo");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");

let escalas = [];
let mesSelecionado = null;
let anoSelecionado = null;

btn.addEventListener("click", () => {
  const val = input.value;
  if (!val) return mostrarMensagem("Escolha o mês", true);
  const [ano, mes] = val.split("-").map(Number);
  mesSelecionado = mes;
  anoSelecionado = ano;
  gerarCalendario(mes, ano);
});

function mostrarMensagem(texto, isErro = false) {
  mensagemDiv.textContent = texto;
  mensagemDiv.style.color = isErro ? "red" : "green";
  setTimeout(() => mensagemDiv.textContent = "", 4000);
}

async function gerarCalendario(mes, ano) {
  calendarioDiv.innerHTML = "";
  mensagemDiv.textContent = "";
  const dataInicio = new Date(ano, mes - 1, 1);
  const dataFim = new Date(ano, mes, 0);
  const totalDias = dataFim.getDate();

  try {
    const escalasSnapshot = await getDocs(collection(db, "escalas"));
    escalas = escalasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    return mostrarMensagem("Erro ao buscar escalas: " + e.message, true);
  }

  const table = document.createElement("table");
  table.border = 1;
  table.cellPadding = 5;

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  diasSemana.forEach(d => {
    const th = document.createElement("th");
    th.textContent = d;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  let tr = document.createElement("tr");

  for (let i = 0; i < dataInicio.getDay(); i++) {
    tr.appendChild(document.createElement("td"));
  }

  for (let dia = 1; dia <= totalDias; dia++) {
    const data = `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    const dataObj = new Date(data);
    const td = document.createElement("td");

    td.innerHTML = `<strong>${dia}</strong><br/>`;

    const doDia = escalas.filter(e => e.data === data);

    doDia.forEach(esc => {
      const div = document.createElement("div");
      div.textContent = `${esc.nome} (${esc.periodo}) `;

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "✏️";
      btnEditar.onclick = () => abrirModalEditar(esc);

      const btnRemover = document.createElement("button");
      btnRemover.textContent = "🗑️";
      btnRemover.onclick = () => removerEscala(esc);

      div.appendChild(btnEditar);
      div.appendChild(btnRemover);
      td.appendChild(div);
    });

    const btnAdd = document.createElement("button");
    btnAdd.textContent = "➕";
    btnAdd.title = "Adicionar escala";
    btnAdd.addEventListener("click", () => abrirModalAdicionar(data));
    td.appendChild(btnAdd);

    tr.appendChild(td);

    if (dataObj.getDay() === 6 || dia === totalDias) {
      tbody.appendChild(tr);
      tr = document.createElement("tr");
    }
  }

  table.appendChild(tbody);
  calendarioDiv.appendChild(table);
}


function abrirModalAdicionar(data) {
  modal.style.display = "flex"; 
  document.getElementById("modalTitulo").innerText = "Adicionar Escala";
  escalaId.value = "";
  escalaData.value = data;
  funcionarioNome.value = "";
  periodo.value = "";
}

function abrirModalEditar(id, nome, turno) {
  modal.style.display = "flex";
  document.getElementById("modalTitulo").innerText = "Editar Escala";
  escalaId.value = id;
  funcionarioNome.value = nome;
  periodo.value = turno;
}

btnCancelar.onclick = () => {
  modal.style.display = "none";
};

formEscala.onsubmit = async (e) => {
  e.preventDefault();

  const nome = funcionarioNome.value.trim();
  const turno = periodo.value;
  const id = escalaId.value;
  const data = escalaData.value;

  if (!nome || !turno) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    if (id) {

      await updateDoc(doc(db, "escalas", id), { nome, periodo: turno });
      alert("Escala atualizada com sucesso.");
    } else {

      await addDoc(collection(db, "escalas"), { nome, periodo: turno, data });
      alert("Escala adicionada com sucesso.");
    }
    modal.style.display = "none";

    location.reload();
  } catch (error) {
    alert("Erro ao salvar: " + error.message);
  }
};

async function removerEscala(escala) {
  const confirmar = confirm(`Deseja remover a escala de ${escala.nome} em ${escala.data}?`);

  if (!confirmar) return;

  try {
    await deleteDoc(doc(db, "escalas", escala.id));
    mostrarMensagem("Escala removida com sucesso.");
    gerarCalendario(mesSelecionado, anoSelecionado); 
  } catch (error) {
    mostrarMensagem("Erro ao remover a escala: " + error.message, true);
  }
}
