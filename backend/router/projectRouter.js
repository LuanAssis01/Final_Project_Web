import { projectController } from '../controller/projectController.js';

export function projectRouter(req, res) {
  const urlParts = req.url.split('/');
  const id = urlParts[3];

  if (req.method === 'GET' && urlParts.length === 3) {
    return projectController.getAll(req, res);
  }

  if (req.method === 'GET' && id) {
    return projectController.getById(req, res, id);
  }

  if (req.method === 'POST') {
    return projectController.create(req, res);
  }

  if (req.method === 'PUT' && id) {
    return projectController.update(req, res, id);
  }

  if (req.method === 'DELETE' && id) {
    return projectController.delete(req, res, id);
  }

  res.writeHead(405);
  res.end('Método não permitido');
}
