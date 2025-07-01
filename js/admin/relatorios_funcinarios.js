import { db } from './../../firebase/firebaseConfig.js';
import {
  collection, getDocs
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const btnGerar = document.getElementById("btnGerar");
const mesanoInput = document.getElementById("mesano");
const msgDiv = document.getElementById("mensagem");

const totalFuncionariosSpan = document.getElementById("totalFuncionarios");
const totalAdminsSpan = document.getElementById("totalAdmins");
const maisHorasSpan = document.getElementById("maisHoras");
const menosHorasSpan = document.getElementById("menosHoras");
const mediaHorasSpan = document.getElementById("mediaHoras");
const maisEscaladosSpan = document.getElementById("maisEscalados");

btnGerar.onclick = async () => {
  const mesano = mesanoInput.value;
  if (!mesano) {
    mostrarMensagem("Selecione o mês para gerar o relatório.", true);
    return;
  }
  const [ano, mes] = mesano.split("-").map(Number);
  mostrarMensagem("Carregando dados...");

  try {
    const funcionariosSnapshot = await getDocs(collection(db, "funcionario"));
    const funcionarios = funcionariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    totalFuncionariosSpan.textContent = funcionarios.length;

    const admins = funcionarios.filter(f => f.cargo?.toLowerCase() === "admin");
    totalAdminsSpan.textContent = admins.length;

    const registrosSnapshot = await getDocs(collection(db, "registros_ponto"));
    const registros = registrosSnapshot.docs.map(doc => doc.data());

    const horasPorFuncionario = {};

    registros.forEach(r => {
      if (!r.uid || !r.data) return;

      const horas = Number(r.horas); 
      if (isNaN(horas)) return;     

      const dataRegistro = new Date(r.data);
      if (dataRegistro.getFullYear() !== ano || (dataRegistro.getMonth() + 1) !== mes) return;

      horasPorFuncionario[r.uid] = (horasPorFuncionario[r.uid] || 0) + horas;
    });

    function buscarNomePorUid(uid) {
      const f = funcionarios.find(func => func.id === uid);
      return f ? (f.nome || f.email || "(Sem Nome)") : "(Não encontrado)";
    }

    let maxHoras = -Infinity;
    let minHoras = Infinity;
    let maxFuncionario = null;
    let minFuncionario = null;
    let somaHoras = 0;

    const funcionariosComHoras = Object.entries(horasPorFuncionario);
    funcionariosComHoras.forEach(([uid, totalHoras]) => {
      if (totalHoras > maxHoras) {
        maxHoras = totalHoras;
        maxFuncionario = uid;
      }
      if (totalHoras < minHoras) {
        minHoras = totalHoras;
        minFuncionario = uid;
      }
      somaHoras += totalHoras;
    });

    const mediaHoras = funcionariosComHoras.length
      ? (somaHoras / funcionariosComHoras.length)
      : 0;

    maisHorasSpan.textContent = maxFuncionario
      ? `${buscarNomePorUid(maxFuncionario)} (${maxHoras.toFixed(2)} h)`
      : "Sem dados";

    menosHorasSpan.textContent = (minFuncionario && isFinite(minHoras))
      ? `${buscarNomePorUid(minFuncionario)} (${minHoras.toFixed(2)} h)`
      : "Sem dados";

    mediaHorasSpan.textContent = mediaHoras.toFixed(2) + " h";

    const escalasSnapshot = await getDocs(collection(db, "escalas"));
    const escalasMes = escalasSnapshot.docs
      .map(doc => doc.data())
      .filter(e => {
        if (!e.data) return false;
        const d = new Date(e.data);
        return d.getFullYear() === ano && (d.getMonth() + 1) === mes;
      });


    const escalasPorNome = {};
    escalasMes.forEach(e => {
      if (!e.nome) return;
      escalasPorNome[e.nome] = (escalasPorNome[e.nome] || 0) + 1;
    });

    const escaladosOrdenados = Object.entries(escalasPorNome)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (escaladosOrdenados.length === 0) {
      maisEscaladosSpan.textContent = "Sem dados";
    } else {
      const nomesEscalados = escaladosOrdenados.map(([nome, count]) => {
        return `${nome} (${count} escalas)`;
      });
      maisEscaladosSpan.textContent = nomesEscalados.join(", ");
    }

    mostrarMensagem("Relatório gerado com sucesso.");

  } catch (e) {
    mostrarMensagem("Erro ao gerar relatório: " + e.message, true);
  }
};

function mostrarMensagem(msg, isErro = false) {
  msgDiv.textContent = msg;
  msgDiv.style.color = isErro ? "red" : "green";
  setTimeout(() => { msgDiv.textContent = ""; }, 5000);
}
