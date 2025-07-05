import { impactMetricController } from '../controller/impactMetricController.js';

export function impactMetricRouter(req, res) {
  const urlParts = req.url.split('/');
  const id = urlParts[3];

  if (req.method === 'GET' && urlParts.length === 3) {
    return impactMetricController.getAll(req, res);
  }

  if (req.method === 'GET' && id) {
    return impactMetricController.getById(req, res, id);
  }

  if (req.method === 'POST') {
    return impactMetricController.create(req, res);
  }

  if (req.method === 'PUT' && id) {
    return impactMetricController.update(req, res, id);
  }

  if (req.method === 'DELETE' && id) {
    return impactMetricController.delete(id, res);
  }

  res.writeHead(405);
  res.end('Método não permitido');
}
