import { userController } from '../controller/userController.js';
import url from 'url';

export function userRouter(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const id = parsedUrl.pathname.split('/')[3];

  if (req.method === 'GET' && parsedUrl.pathname === '/api/users') {
    return userController.getAll(req, res);
  }

  if (req.method === 'GET' && parsedUrl.pathname.startsWith('/api/users/')) {
    return userController.getById(req, res, id);
  }

  if (req.method === 'POST' && parsedUrl.pathname === '/api/users') {
    return userController.create(req, res);
  }

  if (req.method === 'PUT' && parsedUrl.pathname.startsWith('/api/users/')) {
    return userController.update(req, res, id);
  }

  if (req.method === 'DELETE' && parsedUrl.pathname.startsWith('/api/users/')) {
    return userController.delete(req, res, id);
  }

  res.writeHead(404);
  res.end('Rota não encontrada');
}
