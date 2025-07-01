import { auth, db } from '../firebase/firebaseConfig.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

function getInputs() {
  return {
    nome: document.getElementById('nome'),
    email: document.getElementById('email'),
    dataNascimento: document.getElementById('data_nascimento'),
    cargo: document.getElementById('cargo'),
    dataContratacao: document.getElementById('data_contratacao'),
    login:  document.getElementById('tipo_login'),
    senha: document.getElementById('senha')
  };
}

function getValores({ nome, email, dataNascimento, cargo, dataContratacao, login, senha }) {
  return {
    nome: nome.value.trim(),
    email: email.value.trim(),
    dataNascimento: dataNascimento.value, 
    cargo: cargo.value.trim(),
    dataContratacao: dataContratacao.value,
    login: login.value,
    senha: senha.value
  };
}

function limpar({nome, email, dataNascimento, cargo, dataContratacao, login, senha}){
  nome.value = '';
  email.value = '';
  dataNascimento.value = '';
  cargo.value = '';
  dataContratacao.value = '';
  login.value = '';
  senha.value = '';
}

document.getElementById("btnEnviar").addEventListener('click', async function(){
  const Inputs = getInputs();
  const dados = getValores(Inputs);

  if (!dados.email || !dados.senha) {
    alert("Email e senha são obrigatórios.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, dados.email, dados.senha);
    const user = userCredential.user;

    await setDoc(doc(db, "funcionario", user.uid), {
      nome: dados.nome,
      email: dados.email,
      dataNascimento: dados.dataNascimento,
      cargo: dados.cargo,
      dataContratacao: dados.dataContratacao,
      login: dados.login
    });

    alert("Usuário cadastrado com sucesso!");
    limpar(Inputs);

  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    if (error.code === "auth/email-already-in-use") {
      alert("Esse email já está em uso.");
    } else if (error.code === "auth/invalid-email") {
      alert("Email inválido.");
    } else if (error.code === "auth/weak-password") {
      alert("Senha muito fraca. Use pelo menos 6 caracteres.");
    } else {
      alert("Erro ao cadastrar: " + error.message);
    }
  }
});
