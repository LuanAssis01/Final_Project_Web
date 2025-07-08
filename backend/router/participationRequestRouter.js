import { participationRequestController } from '../controller/participationRequestController.js';

export function participationRequestRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');
  const [_, resource, param1, param2] = urlParts;

  try {
    if (req.method === 'GET' && resource === 'requests' && !param1) {
      return participationRequestController.getAll(req, res);
    }

    if (req.method === 'GET' && resource === 'requests' && param1 && !param2) {
      return participationRequestController.getById(req, res, param1);
    }

    if (req.method === 'GET' && resource === 'requests' && param1 === 'project' && param2) {
      return participationRequestController.getByProjectId(req, res, param2);
    }

    if (req.method === 'POST' && resource === 'requests' && !param1) {
      return participationRequestController.create(req, res);
    }

    if (req.method === 'PUT' && resource === 'requests' && param1 && !param2) {
      return participationRequestController.update(req, res, param1);
    }

    if (req.method === 'PUT' && resource === 'requests' && param1 && param2) {
      return participationRequestController.changeStatus(
        req,
        res,
        param1,
        param2.toUpperCase()
      );
    }

    if (req.method === 'DELETE' && resource === 'requests' && param1 && !param2) {
      return participationRequestController.delete(req, res, param1);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de solicitações:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}