document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('input[name="name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const password = form.querySelector('#password').value;

    try {
      const res = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      if (res.ok) {
        alert('Usuário cadastrado com sucesso!');
        window.location.href = 'login.html';
      } else {
        const error = await res.text();
        alert('Erro ao cadastrar: ' + error);
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
      alert('Erro ao conectar com o servidor');
    }
  });
});
