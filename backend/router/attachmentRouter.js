import { attachmentController } from '../controller/attachmentController.js';

export function attachmentRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');
  const [_, resource, param1, param2, param3] = urlParts;

  try {
    if (req.method === 'GET' && resource === 'attachments' && !param1) {
      return attachmentController.getAll(req, res);
    }

    if (req.method === 'GET' && resource === 'attachments' && param1 && !param2) {
      return attachmentController.getById(req, res, param1);
    }

    if (req.method === 'GET' && resource === 'attachments' && param1 === 'project' && param2 && !param3) {
      return attachmentController.getByProjectId(req, res, param2);
    }

    if (req.method === 'GET' && resource === 'attachments' && param1 === 'project' && param2 && param3 === 'summary') {
      return attachmentController.getSummary(req, res, param2);
    }

    if (req.method === 'POST' && resource === 'attachments' && !param1) {
      return attachmentController.create(req, res);
    }

    if (req.method === 'PUT' && resource === 'attachments' && param1 && !param2) {
      return attachmentController.update(req, res, param1);
    }

    if (req.method === 'DELETE' && resource === 'attachments' && param1 && !param2) {
      return attachmentController.delete(req, res, param1);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de anexos:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}