import { ImpactMetric } from '../models/entities/impactMetric.js';

export const impactMetricController = {
  async getAll(req, res) {
    const metrics = await ImpactMetric.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(metrics));
  },

  async getById(req, res, id) {
    const metric = await ImpactMetric.findById(id);
    if (!metric) {
      res.writeHead(404);
      return res.end('Métrica não encontrada');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(metric));
  },

  async create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const data = JSON.parse(body);
      const metric = await ImpactMetric.create(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(metric));
    });
  },

  async update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const data = JSON.parse(body);
      const updated = await ImpactMetric.update(id, data);
      if (!updated) {
        res.writeHead(404);
        return res.end('Métrica não encontrada');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    });
  },

  async delete(id, res) {
    const success = await ImpactMetric.delete(id);
    res.writeHead(success ? 204 : 404);
    res.end(success ? undefined : 'Métrica não encontrada');
  }
};
