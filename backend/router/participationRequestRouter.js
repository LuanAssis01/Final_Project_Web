import { participationRequestController } from '../controller/participationRequestController.js';

export function participationRequestRouter(req, res) {
  const urlParts = req.url.split('/');
  const id = urlParts[3];

  if (req.method === 'GET' && urlParts.length === 3) {
    return participationRequestController.getAll(req, res);
  }

  if (req.method === 'GET' && id) {
    return participationRequestController.getById(req, res, id);
  }

  if (req.method === 'POST') {
    return participationRequestController.create(req, res);
  }

  if (req.method === 'PUT' && id) {
    return participationRequestController.update(req, res, id);
  }

  if (req.method === 'DELETE' && id) {
    return participationRequestController.delete(req, res, id);
  }

  res.writeHead(405);
  res.end('Método não permitido');
}
