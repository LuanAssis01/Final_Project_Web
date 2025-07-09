const mockUsers = JSON.parse(localStorage.getItem('users')) || [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@admin.com',
    password: '123',
    role: 'Admin'
  },
  {
    id: 2,
    name: 'Prof. Ana',
    email: 'ana@professor.com',
    password: '123',
    role: 'Professor'
  },
  {
    id: 3,
    name: 'João Aluno',
    email: 'joao@aluno.com',
    password: '123',
    role: 'Aluno'
  }
];

localStorage.setItem('users', JSON.stringify(mockUsers));

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function getLoggedUser() {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function logout() {
  sessionStorage.removeItem('user');
  window.location.href = '/src/pages/public/login.html';
}

function detectRole(email) {
  if (email.endsWith('@admin.com')) return 'Admin';
  if (email.endsWith('@professor.com')) return 'Professor';
  return 'Aluno';
}

async function login(email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) throw new Error('Email ou senha inválidos');
  sessionStorage.setItem('user', JSON.stringify(user));
  return user;
}

async function register(name, email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];

  if (users.find(u => u.email === email)) {
    throw new Error('Este e-mail já está cadastrado.');
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: detectRole(email)
  };

  users.push(newUser);
  saveUsers(users);
  sessionStorage.setItem('user', JSON.stringify(newUser));
  return newUser;
}

// Formulário de Login
const loginForm = document.querySelector('#login-form'); 
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.querySelector('#password').value; 

    try {
      const user = await login(email, password);
      alert(`Bem-vindo, ${user.name}! Redirecionando...`); 
      window.location.href = '../portal/home-logged.html';
    } catch (err) {
      alert(err.message); 
    }
  });
}

// Formulário de Cadastro
const registerForm = document.querySelector('#register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.querySelector('#register-name').value;
    const email = document.querySelector('#register-email').value;
    const password = document.querySelector('#register-password').value;

    try {
      const user = await register(name, email, password);
      alert(`Cadastro realizado! Bem-vindo, ${user.name}!`);
      window.location.href = '/frontend/src/pages/portal/home-logged.html';
    } catch (err) {
      alert(err.message);
    }
  });
}

