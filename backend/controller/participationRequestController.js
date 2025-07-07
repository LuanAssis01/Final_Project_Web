import { ParticipationRequest } from '../models/entities/participationRequest.js';

export const participationRequestController = {
  async getAll(req, res) {
    try {
      const requests = await ParticipationRequest.getAll();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(requests));
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      res.writeHead(500);
      res.end('Erro interno ao buscar solicitações');
    }
  },

  async getById(req, res, id) {
    try {
      const request = await ParticipationRequest.findById(id);
      if (!request) {
        res.writeHead(404);
        return res.end('Solicitação não encontrada');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(request));
    } catch (error) {
      console.error('Erro ao buscar solicitação:', error);
      res.writeHead(500);
      res.end('Erro interno ao buscar solicitação');
    }
  },

  async create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        
        // Validação básica
        if (!data.projectId || !data.userId) {
          res.writeHead(400);
          return res.end('projectId e userId são obrigatórios');
        }

        const request = await ParticipationRequest.create({
          ...data,
          requestedAt: data.requestedAt || new Date().toISOString(),
          status: data.status || 'PENDING'
        });
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(request));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400);
          res.end('JSON inválido');
        } else {
          console.error('Erro ao criar solicitação:', error);
          res.writeHead(500);
          res.end('Erro interno ao criar solicitação');
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
        
        // Não permitir alterar o ID
        if (data.id && data.id !== id) {
          res.writeHead(400);
          return res.end('ID da solicitação não pode ser alterado');
        }

        const updated = await ParticipationRequest.update(id, data);
        if (!updated) {
          res.writeHead(404);
          return res.end('Solicitação não encontrada');
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updated));
      } catch (error) {
        console.error('Erro ao atualizar solicitação:', error);
        res.writeHead(500);
        res.end('Erro interno ao atualizar solicitação');
      }
    });
  },

  async delete(req, res, id) {
    try {
      const success = await ParticipationRequest.delete(id);
      if (!success) {
        res.writeHead(404);
        return res.end('Solicitação não encontrada');
      }
      res.writeHead(204);
      res.end();
    } catch (error) {
      console.error('Erro ao excluir solicitação:', error);
      res.writeHead(500);
      res.end('Erro interno ao excluir solicitação');
    }
  }
};