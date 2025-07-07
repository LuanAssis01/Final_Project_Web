import { notificationController } from '../controller/notificationController.js';

export function notificationRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');
  const id = urlParts[1];
  const action = urlParts[2]; // 'read'

  try {
    if (req.method === 'GET') {
      if (urlParts.length === 1 && !id) {
        return notificationController.getAll(req, res);
      }
      if (id && urlParts.length === 2) {
        return notificationController.getById(req, res, id);
      }
      if (urlParts[0] === 'user' && id) {
        return notificationController.getByUserId(req, res, id);
      }
    }

    if (req.method === 'POST') {
      if (urlParts.length === 1) {
        return notificationController.create(req, res);
      }
    }

    if (req.method === 'PUT') {
      if (id && urlParts.length === 2) {
        return notificationController.update(req, res, id);
      }
      if (id && action === 'read') {
        return notificationController.markAsRead(req, res, id);
      }
    }

    if (req.method === 'DELETE' && id && urlParts.length === 2) {
      return notificationController.delete(req, res, id);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de notificações:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}