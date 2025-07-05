// router/index.js
import { userRouter } from './userRouter.js';

export function mainRouter(req, res) {
  if (req.url.startsWith('/api/users')) {
    return userRouter(req, res);
  }

  // Aqui você pode ir adicionando mais rotas no futuro:
  // if (req.url.startsWith('/api/projects')) return projectRouter(req, res);

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Rota não encontrada');
}
