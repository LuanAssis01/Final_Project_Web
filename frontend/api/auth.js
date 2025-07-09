export async function login(email, password) {
  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
}

export async function register(name, email, password) {
  const response = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
}

export async function getLoggedUser() {
  try {
    const token = localStorage.getItem('token'); // Supondo que o token de autenticação está no localStorage
    if (!token) {
      console.error('Nenhum token encontrado');
      return null;
    }

    const response = await fetch('http://localhost:3000/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do usuário');
    }

    const userData = await response.json();
    return userData; // { id, name, role, ... }
  } catch (error) {
    console.error('Erro em getLoggedUser:', error);
    return null;
  }
}