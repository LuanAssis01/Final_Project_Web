import { profileController } from '../controller/profileController.js';

export function profileRouter(req, res) {
  const urlParts = req.url.split('/');
  const id = urlParts[3];

  if (req.method === 'GET' && urlParts.length === 3) {
    return profileController.getAll(req, res);
  }

  if (req.method === 'GET' && id) {
    return profileController.getById(req, res, id);
  }

  if (req.method === 'POST') {
    return profileController.create(req, res);
  }

  if (req.method === 'PUT' && id) {
    return profileController.update(req, res, id);
  }

  if (req.method === 'DELETE' && id) {
    return profileController.delete(req, res, id);
  }

  res.writeHead(405);
  res.end('Método não permitido');
}
