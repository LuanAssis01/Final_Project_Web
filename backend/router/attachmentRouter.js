import { attachmentController } from '../controller/attachmentController.js';

export function attachmentRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');
  const id = urlParts[1];
  const projectId = urlParts[3];

  try {
    if (req.method === 'GET') {
      if (urlParts.length === 1 && !id) {
        return attachmentController.getAll(req, res);
      }
      if (id && urlParts.length === 2) {
        return attachmentController.getById(req, res, id);
      }
      if (urlParts[2] === 'project' && projectId) {
        if (urlParts[4] === 'summary') {
          return attachmentController.getSummary(req, res, projectId);
        }
        return attachmentController.getByProjectId(req, res, projectId);
      }
    }

    if (req.method === 'POST') {
      if (urlParts.length === 1) {
        return attachmentController.create(req, res);
      }
    }

    if (req.method === 'PUT' && id && urlParts.length === 2) {
      return attachmentController.update(req, res, id);
    }

    if (req.method === 'DELETE' && id && urlParts.length === 2) {
      return attachmentController.delete(req, res, id);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de anexos:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}