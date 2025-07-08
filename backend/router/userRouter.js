import { userController } from '../controller/userController.js';
import { URL } from 'url';

export function userRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');
  const [_, resource, param1, param2] = urlParts;

  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const email = parsedUrl.searchParams.get('email');

    if (req.method === 'GET' && resource === 'users' && !param1) {
      if (email) return userController.getByEmail(req, res, email);
      return userController.getAll(req, res);
    }

    if (req.method === 'GET' && resource === 'users' && param1 && !param2) {
      return userController.getById(req, res, param1);
    }

    if (req.method === 'GET' && resource === 'users' && param1 && param2) {
      if (param2 === 'profile') return userController.getProfile(req, res, param1);
      if (param2 === 'notifications') return userController.getNotifications(req, res, param1);
    }

    if (req.method === 'POST' && resource === 'users' && !param1) {
      return userController.create(req, res);
    }

    if (req.method === 'PUT' && resource === 'users' && param1 && !param2) {
      return userController.update(req, res, param1);
    }

    if (req.method === 'PUT' && resource === 'users' && param1 && param2 === 'password') {
      return userController.changePassword(req, res, param1);
    }

    if (req.method === 'DELETE' && resource === 'users' && param1 && !param2) {
      return userController.delete(req, res, param1);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de usuários:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}