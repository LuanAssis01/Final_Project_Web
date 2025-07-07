import { projectController } from '../controller/projectController.js';

export function projectRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');

  try {
    const [_, resource, param1, param2] = urlParts;

    // [GET] /api/projects
    if (req.method === 'GET' && resource === 'projects' && !param1) {
      return projectController.getAll(req, res);
    }

    // [GET] /api/projects/:id
    if (req.method === 'GET' && resource === 'projects' && param1 && !param2) {
      return projectController.getById(req, res, param1);
    }

    // [GET] /api/projects/:id/metrics
    if (req.method === 'GET' && resource === 'projects' && param2 === 'metrics') {
      return projectController.getMetrics(req, res, param1);
    }

    // [GET] /api/projects/:id/comments
    if (req.method === 'GET' && resource === 'projects' && param2 === 'comments') {
      return projectController.getComments(req, res, param1);
    }

    // [GET] /api/projects/:id/attachments
    if (req.method === 'GET' && resource === 'projects' && param2 === 'attachments') {
      return projectController.getAttachments(req, res, param1);
    }

    // [POST] /api/projects
    if (req.method === 'POST' && resource === 'projects' && !param1) {
      return projectController.create(req, res);
    }

    // [PUT] /api/projects/:id
    if (req.method === 'PUT' && resource === 'projects' && param1 && !param2) {
      return projectController.update(req, res, param1);
    }

    // [DELETE] /api/projects/:id
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
