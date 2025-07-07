import { projectController } from '../controller/projectController.js';

export function projectRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');
  const id = urlParts[1];
  const resource = urlParts[2]; // 'metrics', 'comments', etc.

  try {
    if (req.method === 'GET') {
      if (urlParts.length === 1 && !id) {
        return projectController.getAll(req, res);
      }
      if (id && urlParts.length === 2) {
        return projectController.getById(req, res, id);
      }
      if (id && resource === 'metrics') {
        return projectController.getMetrics(req, res, id);
      }
      if (id && resource === 'comments') {
        return projectController.getComments(req, res, id);
      }
      if (id && resource === 'attachments') {
        return projectController.getAttachments(req, res, id);
      }
    }

    if (req.method === 'POST') {
      if (urlParts.length === 1) {
        return projectController.create(req, res);
      }
    }

    if (req.method === 'PUT' && id && urlParts.length === 2) {
      return projectController.update(req, res, id);
    }

    if (req.method === 'DELETE' && id && urlParts.length === 2) {
      return projectController.delete(req, res, id);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de projetos:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}