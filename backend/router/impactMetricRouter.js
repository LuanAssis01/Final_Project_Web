import { impactMetricController } from '../controller/impactMetricController.js';

export function impactMetricRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');
  const [_, resource, param1, param2] = urlParts;

  try {
    if (req.method === 'GET' && resource === 'metrics' && !param1) {
      return impactMetricController.getAll(req, res);
    }

    if (req.method === 'GET' && resource === 'metrics' && param1 && !param2) {
      return impactMetricController.getById(req, res, param1);
    }

    if (req.method === 'GET' && resource === 'metrics' && param1 === 'project' && param2) {
      return impactMetricController.getMetrics(req, res, param2);
    }

    if (req.method === 'POST' && resource === 'metrics' && !param1) {
      return impactMetricController.create(req, res);
    }

    if (req.method === 'PUT' && resource === 'metrics' && param1 && !param2) {
      return impactMetricController.update(req, res, param1);
    }

    if (req.method === 'DELETE' && resource === 'metrics' && param1 && !param2) {
      return impactMetricController.delete(req, res, param1);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de métricas:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}
