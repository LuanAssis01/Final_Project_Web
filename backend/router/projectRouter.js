import { projectController } from '../controller/projectController.js';

export function projectRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');

  try {
    const [_, resource, param1, param2] = urlParts;

    if (req.method === 'GET' && resource === 'projects' && !param1) {
      return projectController.getAll(req, res);
    }

    if (req.method === 'GET' && resource === 'projects' && param1 && !param2) {
      return projectController.getById(req, res, param1);
    }

    if (req.method === 'GET' && resource === 'projects' && param2 === 'metrics') {
      return projectController.getMetrics(req, res, param1);
    }

    if (req.method === 'GET' && resource === 'projects' && param2 === 'comments') {
      return projectController.getComments(req, res, param1);
    }

    if (req.method === 'GET' && resource === 'projects' && param2 === 'attachments') {
      return projectController.getAttachments(req, res, param1);
    }

    if (req.method === 'POST' && resource === 'projects' && !param1) {
      return projectController.create(req, res);
    }

    if (req.method === 'PUT' && resource === 'projects' && param1 && !param2) {
      return projectController.update(req, res, param1);
    }

    if (req.method === 'DELETE' && resource === 'projects' && param1 && !param2) {
      return projectController.delete(req, res, param1);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de projetos:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}
