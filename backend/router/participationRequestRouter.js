import { participationRequestController } from '../controller/participationRequestController.js';

export function participationRequestRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');
  const id = urlParts[1];
  const action = urlParts[2]; // 'approve' ou 'reject'
  const projectId = urlParts[3]; // Para rotas de projeto

  try {
    if (req.method === 'GET') {
      if (urlParts.length === 1 && !id) {
        return participationRequestController.getAll(req, res);
      }
      if (id && urlParts.length === 2) {
        return participationRequestController.getById(req, res, id);
      }
      if (urlParts[0] === 'project' && projectId) {
        return participationRequestController.getByProjectId(req, res, projectId);
      }
    }

    if (req.method === 'POST') {
      if (urlParts.length === 1) {
        return participationRequestController.create(req, res);
      }
    }

    if (req.method === 'PUT') {
      if (id && urlParts.length === 2) {
        return participationRequestController.update(req, res, id);
      }
      if (id && action) {
        return participationRequestController.changeStatus(
          req, 
          res, 
          id, 
          action.toUpperCase()
        );
      }
    }

    if (req.method === 'DELETE' && id && urlParts.length === 2) {
      return participationRequestController.delete(req, res, id);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de solicitações:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}