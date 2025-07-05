import { ImpactMetric } from '../models/entities/impactMetric.js';

export const impactMetricController = {
  getAll(req, res) {
    const metrics = ImpactMetric.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(metrics));
  },

  getById(req, res, id) {
    const metric = ImpactMetric.findById(id);
    if (!metric) {
      res.writeHead(404);
      return res.end('Métrica não encontrada');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(metric));
  },

  create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const metric = ImpactMetric.create(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(metric));
    });
  },

  update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const updated = ImpactMetric.update(id, data);
      if (!updated) {
        res.writeHead(404);
        return res.end('Métrica não encontrada');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    });
  },

  delete(id, res) {
    const success = ImpactMetric.delete(id);
    res.writeHead(success ? 204 : 404);
    res.end(success ? undefined : 'Métrica não encontrada');
  }
};
