import { User } from '../models/entities/user.js';

export async function authRouter(req, res) {
  if (req.method === 'POST' && req.url === '/api/login') {
    let body = '';
    req.on('data', chunk => body += chunk);
    
    req.on('end', async () => {
      try {
        const { email, password } = JSON.parse(body);
        if (!email || !password) {
          res.writeHead(400);
          return res.end('E-mail e senha são obrigatórios');
        }

        const users = await User.getAll();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
          res.writeHead(401);
          return res.end('Credenciais inválidas');
        }

        const { password: _, ...userWithoutPassword } = user;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(userWithoutPassword));
      } catch (error) {
        console.error('Erro no login:', error);
        res.writeHead(500);
        res.end('Erro interno no servidor');
      }
    });

    return;
  }

  res.writeHead(404);
  res.end('Rota não encontrada');
}
