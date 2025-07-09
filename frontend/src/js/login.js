import { login } from '../../api/auth.js';

document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('#password').value;

  try {
    const user = await login(email, password);
    alert(`Bem-vindo, ${user.name}`);

    window.location.href = '/frontend/home.html';
  } catch (error) {
    alert('Falha no login: ' + error.message);
  }
});
