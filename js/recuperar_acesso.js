import { auth } from '../firebase/firebaseConfig.js';
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

document.getElementById("form-recuperar").addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Por favor, insira seu e-mail.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Um link de recuperação foi enviado para seu e-mail.");
  } catch (error) {
    console.error("Erro ao enviar email de recuperação:", error);
    if (error.code === "auth/user-not-found") {
      alert("Nenhuma conta encontrada com esse e-mail.");
    } else if (error.code === "auth/invalid-email") {
      alert("E-mail inválido.");
    } else {
      alert("Erro ao enviar o email: " + error.message);
    }
  }
});
