import { userController } from '../controller/userController.js';
import { URL } from 'url';

export function userRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');
  const id = urlParts[1];
  const action = urlParts[2]; // 'profile', 'notifications', etc.

  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const email = parsedUrl.searchParams.get('email');

    if (req.method === 'GET') {
      if (urlParts.length === 1 && !id) {
        if (email) {
          return userController.getByEmail(req, res, email);
        }
        return userController.getAll(req, res);
      }
      if (id && urlParts.length === 2) {
        return userController.getById(req, res, id);
      }
      if (id && action === 'profile') {
        return userController.getProfile(req, res, id);
      }
      if (id && action === 'notifications') {
        return userController.getNotifications(req, res, id);
      }
    }

    if (req.method === 'POST') {
      if (urlParts.length === 1) {
        return userController.create(req, res);
      }
    }

    if (req.method === 'PUT') {
      if (id && urlParts.length === 2) {
        return userController.update(req, res, id);
      }
      if (id && action === 'password') {
        return userController.changePassword(req, res, id);
      }
    }

    if (req.method === 'DELETE' && id && urlParts.length === 2) {
      return userController.delete(req, res, id);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de usuários:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}