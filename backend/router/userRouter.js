import { userController } from '../controller/userController.js';
import { URL } from 'url';

export function userRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');

  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const email = parsedUrl.searchParams.get('email');

    // [GET] /api/users
    if (req.method === 'GET') {
      if (urlParts[0] === 'api' && urlParts[1] === 'users' && !urlParts[2]) {
        if (email) return userController.getByEmail(req, res, email);
        return userController.getAll(req, res);
      }

      // [GET] /api/users/:id
      if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'users') {
        const id = urlParts[2];
        return userController.getById(req, res, id);
      }

      // [GET] /api/users/:id/profile ou /:id/notifications
      if (urlParts.length === 4 && urlParts[0] === 'api' && urlParts[1] === 'users') {
        const id = urlParts[2];
        const action = urlParts[3];
        if (action === 'profile') return userController.getProfile(req, res, id);
        if (action === 'notifications') return userController.getNotifications(req, res, id);
      }
    }

    // [POST] /api/users
    if (req.method === 'POST') {
      if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'users') {
        return userController.create(req, res);
      }
    }

    // [PUT] /api/users/:id ou /:id/password
    if (req.method === 'PUT') {
      if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'users') {
        const id = urlParts[2];
        return userController.update(req, res, id);
      }
      if (urlParts.length === 4 && urlParts[0] === 'api' && urlParts[1] === 'users' && urlParts[3] === 'password') {
        const id = urlParts[2];
        return userController.changePassword(req, res, id);
      }
    }

    // [DELETE] /api/users/:id
    if (req.method === 'DELETE') {
      if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'users') {
        const id = urlParts[2];
        return userController.delete(req, res, id);
      }
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de usuários:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}