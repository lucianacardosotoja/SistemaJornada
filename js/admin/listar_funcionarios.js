import { db } from './../../firebase/firebaseConfig.js';
import { collection, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const tbody = document.getElementById('funcionarios-tbody');
const funcionariosCollection = collection(db, 'funcionario');

async function listarFuncionarios() {
  tbody.innerHTML = '';
  try {
    const snapshot = await getDocs(funcionariosCollection);

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const id = docSnap.id;

      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${data.nome}</td>
        <td>${data.email}</td>
        <td>${data.cargo}</td>
        <td>${data.dataContratacao}</td>
        <td>${data.login}</td>
        <td>
          <button data-id="${id}" class="btn-editar">Editar</button>
          <button data-id="${id}" class="btn-excluir" style="margin-left: 6px;">Excluir</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    adicionarEventos();
  } catch (error) {
    console.error('Erro ao listar funcionários:', error);
  }
}

function adicionarEventos() {
  document.querySelectorAll('.btn-excluir').forEach(button => {
    button.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      if (confirm('Deseja realmente excluir este funcionário?')) {
        try {
          await deleteDoc(doc(db, 'funcionario', id));
          alert('Funcionário excluído com sucesso.');
          listarFuncionarios();
        } catch (error) {
          console.error('Erro ao excluir funcionário:', error);
          alert('Erro ao excluir funcionário.');
        }
      }
    });
  });

  document.querySelectorAll('.btn-editar').forEach(button => {
    button.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      const funcionarioRef = doc(db, 'funcionario', id);

      try {
        const snapshot = await funcionarioRef.get();
        const data = snapshot.data();

        const novoNome = prompt('Editar nome:', data.nome);
        if (novoNome === null) return;
        const novoCargo = prompt('Editar cargo:', data.cargo);
        if (novoCargo === null) return;

        await updateDoc(funcionarioRef, {
          nome: novoNome.trim(),
          cargo: novoCargo.trim()
        });

        alert('Funcionário atualizado com sucesso.');
        listarFuncionarios();
      } catch (error) {
        console.error('Erro ao editar funcionário:', error);
        alert('Erro ao editar funcionário.');
      }
    });
  });
}

listarFuncionarios();
