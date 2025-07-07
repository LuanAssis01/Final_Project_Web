import { ParticipationRequest } from '../models/entities/participationRequest.js';

// Helper functions
const sendResponse = (res, statusCode, data = null, headers = {}) => {
  const defaultHeaders = { 'Content-Type': 'application/json' };
  res.writeHead(statusCode, { ...defaultHeaders, ...headers });
  res.end(data ? JSON.stringify(data) : undefined);
};

const parseRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
};

export const participationRequestController = {
  async getAll(req, res) {
    try {
      const requests = await ParticipationRequest.getAll();
      return sendResponse(res, 200, requests);
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      return sendResponse(res, 500, { error: 'Erro interno ao buscar solicitações' });
    }
  },

  async getById(req, res, id) {
    try {
      const request = await ParticipationRequest.findById(id);
      if (!request) {
        return sendResponse(res, 404, { error: 'Solicitação não encontrada' });
      }
      return sendResponse(res, 200, request);
    } catch (error) {
      console.error('Erro ao buscar solicitação:', error);
      return sendResponse(res, 500, { error: 'Erro interno ao buscar solicitação' });
    }
  },

  async create(req, res) {
    try {
      const data = await parseRequestBody(req);
      
      // Validação básica
      if (!data.projectId || !data.userId) {
        return sendResponse(res, 400, { 
          error: 'Campos obrigatórios faltando',
          required: ['projectId', 'userId']
        });
      }

      const request = await ParticipationRequest.create({
        ...data,
        requestedAt: data.requestedAt || new Date().toISOString(),
        status: data.status || 'PENDING'
      });
      
      return sendResponse(res, 201, request);
    } catch (error) {
      if (error.message === 'Invalid JSON format') {
        return sendResponse(res, 400, { error: 'JSON inválido' });
      }
      console.error('Erro ao criar solicitação:', error);
      return sendResponse(res, 500, { error: 'Erro interno ao criar solicitação' });
    }
  },

  async update(req, res, id) {
    try {
      const data = await parseRequestBody(req);
      
      // Não permitir alterar o ID
      if (data.id && data.id !== id) {
        return sendResponse(res, 400, { error: 'ID da solicitação não pode ser alterado' });
      }

      const updated = await ParticipationRequest.update(id, data);
      if (!updated) {
        return sendResponse(res, 404, { error: 'Solicitação não encontrada' });
      }
      
      return sendResponse(res, 200, updated);
    } catch (error) {
      if (error.message === 'Invalid JSON format') {
        return sendResponse(res, 400, { error: 'JSON inválido' });
      }
      console.error('Erro ao atualizar solicitação:', error);
      return sendResponse(res, 500, { error: 'Erro interno ao atualizar solicitação' });
    }
  },

  async delete(req, res, id) {
    try {
      const success = await ParticipationRequest.delete(id);
      if (!success) {
        return sendResponse(res, 404, { error: 'Solicitação não encontrada' });
      }
      return sendResponse(res, 204);
    } catch (error) {
      console.error('Erro ao excluir solicitação:', error);
      return sendResponse(res, 500, { error: 'Erro interno ao excluir solicitação' });
    }
  },

  // Método adicional para atualizar status
  async updateStatus(req, res, id) {
    try {
      const data = await parseRequestBody(req);
      
      if (!data.status) {
        return sendResponse(res, 400, { error: 'Novo status é obrigatório' });
      }

      const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
      if (!validStatuses.includes(data.status)) {
        return sendResponse(res, 400, { 
          error: 'Status inválido',
          validStatuses
        });
      }

      const updated = await ParticipationRequest.update(id, { status: data.status });
      if (!updated) {
        return sendResponse(res, 404, { error: 'Solicitação não encontrada' });
      }
      
      return sendResponse(res, 200, updated);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      return sendResponse(res, 500, { error: 'Erro interno ao atualizar status' });
    }
  }
};