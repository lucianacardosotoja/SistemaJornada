import { auth, db } from './../../firebase/firebaseConfig.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const btnBuscar = document.getElementById('btnBuscar');
const relatorioLista = document.getElementById('relatorioLista');
const totalHorasEl = document.getElementById('totalHoras');
const inputMes = document.getElementById('mes');

let uidUsuario = null;

onAuthStateChanged(auth, user => {
  if (user) {
    uidUsuario = user.uid;
  } else {
    alert("Você precisa estar logado para ver o relatório.");
    window.location.href = "../index.html";
  }
});

btnBuscar.addEventListener('click', async () => {
  if (!uidUsuario) return;

  const mesSelecionado = inputMes.value; 
  if (!mesSelecionado) {
    alert("Selecione um mês.");
    return;
  }

  const [ano, mes] = mesSelecionado.split("-");
  const registros = await buscarRegistros(uidUsuario, mes, ano);
  const relatorio = processarRelatorio(registros);
  exibirRelatorio(relatorio);
});

async function buscarRegistros(uid, mes, ano) {
  const q = query(collection(db, "registros_ponto"), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  const registros = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    const [dia, mesDoc, anoDoc] = data.data.split("/");
    if (mesDoc === mes && anoDoc === ano) {
      registros.push(data);
    }
  });

  return registros.sort((a, b) => {
    const da = new Date(a.data + " " + a.horario);
    const db = new Date(b.data + " " + b.horario);
    return da - db;
  });
}

function processarRelatorio(registros) {
  const dias = {};
  registros.forEach(reg => {
    if (!dias[reg.data]) dias[reg.data] = [];
    dias[reg.data].push(reg);
  });

  const resultado = [];
  let totalMinutos = 0;

  for (const data in dias) {
    const eventos = dias[data];
    const entradas = eventos.filter(e => e.tipo === "Entrada");
    const saidas = eventos.filter(e => e.tipo === "Saída");

    if (entradas.length && saidas.length) {
      const entrada = new Date(`${data} ${entradas[0].horario}`);
      const saida = new Date(`${data} ${saidas[0].horario}`);
      const minutos = (saida - entrada) / (1000 * 60);

      totalMinutos += minutos;
      resultado.push({ data, horas: formatarMinutos(minutos) });
    }
  }

  return { dias: resultado, total: formatarMinutos(totalMinutos) };
}

function exibirRelatorio({ dias, total }) {
  relatorioLista.innerHTML = '';
  dias.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.data}: ${item.horas}`;
    relatorioLista.appendChild(li);
  });
  totalHorasEl.textContent = total;
}

function formatarMinutos(minutos) {
  const h = Math.floor(minutos / 60).toString().padStart(2, '0');
  const m = Math.floor(minutos % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}
