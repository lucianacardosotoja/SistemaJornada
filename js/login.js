import { auth, db } from '../firebase/firebaseConfig.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

export async function fazerLogin(email, senha) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    const userDocRef = doc(db, "funcionario", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const dados = userDoc.data();
      console.log("Usuário autenticado:", dados.nome);
      console.log("Login:", dados.login);

      if (dados.login == "admin") {
        window.location.href = "./../pages/admin/home_page_admin.html";
        
      } else if (dados.login == "funcionario") {
        window.location.href = "./../pages/funcionario/home_page_func.html";
      } else {
        alert("Cargo não reconhecido. Acesso negado.");
      }
    } else {
      alert("Dados do usuário não encontrados.");
    }

  } catch (error) {
    console.error("Erro no login:", error);

    if (error.code === 'auth/user-not-found') {
      alert("Usuário não encontrado.");
    } else if (error.code === 'auth/wrong-password') {
      alert("Senha incorreta.");
    } else if (error.code === 'auth/invalid-email') {
      alert("Email inválido.");
    } else if (error.code === 'auth/invalid-credential') {
      alert("Senha inválida!");
    } else {
      alert("Erro no login: " + error.message);
    }
  }
}
