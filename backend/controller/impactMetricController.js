import { ImpactMetric } from '../models/entities/impactMetric.js';

export const impactMetricController = {
  async getAll(req, res) {
    try {
      const metrics = await ImpactMetric.getAll();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(metrics));
    } catch (error) {
      res.writeHead(500);
      res.end('Erro interno ao buscar métricas');
    }
  },

  async getById(req, res, id) {
    try {
      const metric = await ImpactMetric.findById(id);
      if (!metric) {
        res.writeHead(404);
        return res.end('Métrica não encontrada');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(metric));
    } catch (error) {
      res.writeHead(500);
      res.end('Erro interno ao buscar métrica');
    }
  },

  async create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        
        // Validação mínima
        if (!data.projectId || !data.name || !data.value) {
          res.writeHead(400);
          return res.end('Dados incompletos: projectId, name e value são obrigatórios');
        }

        const metric = await ImpactMetric.create(data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(metric));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400);
          res.end('JSON inválido');
        } else {
          res.writeHead(500);
          res.end('Erro interno ao criar métrica');
        }
      }
    });
  },

  async update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const updated = await ImpactMetric.update(id, data);
        
        if (!updated) {
          res.writeHead(404);
          return res.end('Métrica não encontrada');
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updated));
      } catch (error) {
        res.writeHead(500);
        res.end('Erro interno ao atualizar métrica');
      }
    });
  },

  async delete(req, res, id) {
    try {
      const success = await ImpactMetric.delete(id);
      
      if (!success) {
        res.writeHead(404);
        return res.end('Métrica não encontrada');
      }
      
      res.writeHead(204);
      res.end();
    } catch (error) {
      res.writeHead(500);
      res.end('Erro interno ao excluir métrica');
    }
  }
};