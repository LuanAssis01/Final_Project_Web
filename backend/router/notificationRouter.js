import { notificationController } from '../controller/notificationController.js';

export function notificationRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');
  const [_, resource, param1, param2] = urlParts;

  try {
    if (req.method === 'GET' && resource === 'notifications' && !param1) {
      return notificationController.getAll(req, res);
    }

    if (req.method === 'GET' && resource === 'notifications' && param1 && !param2) {
      return notificationController.getById(req, res, param1);
    }

    if (req.method === 'GET' && resource === 'notifications' && param1 === 'user' && param2) {
      return notificationController.getByUserId(req, res, param2);
    }

    if (req.method === 'POST' && resource === 'notifications' && !param1) {
      return notificationController.create(req, res);
    }

    if (req.method === 'PUT' && resource === 'notifications' && param1 && !param2) {
      return notificationController.update(req, res, param1);
    }

    if (req.method === 'PUT' && resource === 'notifications' && param1 && param2 === 'read') {
      return notificationController.markAsRead(req, res, param1);
    }

    if (req.method === 'DELETE' && resource === 'notifications' && param1 && !param2) {
      return notificationController.delete(req, res, param1);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de notificações:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}
