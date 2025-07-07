import { impactMetricController } from '../controller/impactMetricController.js';

export function impactMetricRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');
  const id = urlParts[1];
  const projectId = urlParts[3]; 

  try {
    if (req.method === 'GET') {
      if (urlParts.length === 1 && !id) {
        return impactMetricController.getAll(req, res);
      }
      if (id && urlParts.length === 2) {
        return impactMetricController.getById(req, res, id);
      }
      if (urlParts[0] === 'project' && projectId) {
        return impactMetricController.getMetrics(req, res, projectId);
      }
    }

    if (req.method === 'POST') {
      if (urlParts.length === 1) {
        return impactMetricController.create(req, res);
      }
    }

    if (req.method === 'PUT' && id && urlParts.length === 2) {
      return impactMetricController.update(req, res, id);
    }

    if (req.method === 'DELETE' && id && urlParts.length === 2) {
      return impactMetricController.delete(req, res, id);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de métricas:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}