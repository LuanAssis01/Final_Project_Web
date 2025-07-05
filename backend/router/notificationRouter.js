import { notificationController } from '../controller/notificationController.js';

export function notificationRouter(req, res) {
  const urlParts = req.url.split('/');
  const id = urlParts[3];

  if (req.method === 'GET' && urlParts.length === 3) {
    return notificationController.getAll(req, res);
  }

  if (req.method === 'GET' && id) {
    return notificationController.getById(req, res, id);
  }

  if (req.method === 'POST') {
    return notificationController.create(req, res);
  }

  if (req.method === 'PUT' && id) {
    return notificationController.update(req, res, id);
  }

  if (req.method === 'DELETE' && id) {
    return notificationController.delete(req, res, id);
  }

  res.writeHead(405);
  res.end('Método não permitido');
}
