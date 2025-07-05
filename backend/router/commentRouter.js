import { commentController } from '../controller/commentController.js';

export function commentRouter(req, res) {
  const urlParts = req.url.split('/');
  const id = urlParts[3];

  if (req.method === 'GET' && urlParts.length === 3) {
    return commentController.getAll(req, res);
  }

  if (req.method === 'GET' && id) {
    return commentController.getById(req, res, id);
  }

  if (req.method === 'POST') {
    return commentController.create(req, res);
  }

  if (req.method === 'PUT' && id) {
    return commentController.update(req, res, id);
  }

  if (req.method === 'DELETE' && id) {
    return commentController.delete(req, res, id);
  }

  res.writeHead(405);
  res.end('Método não permitido');
}
