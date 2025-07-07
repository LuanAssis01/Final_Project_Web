import { ParticipationRequest } from '../models/entities/participationRequest.js';

export const participationRequestController = {
  async getAll(req, res) {
    const requests = await ParticipationRequest.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(requests));
  },

  async getById(req, res, id) {
    const request = await ParticipationRequest.findById(id);
    if (!request) {
      res.writeHead(404);
      return res.end('Solicitação não encontrada');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(request));
  },

  async create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const data = JSON.parse(body);
      const request = await ParticipationRequest.create(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(request));
    });
  },

  async update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const data = JSON.parse(body);
      const updated = await ParticipationRequest.update(id, data);
      if (!updated) {
        res.writeHead(404);
        return res.end('Solicitação não encontrada');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    });
  },

  async delete(req, res, id) {
    const success = await ParticipationRequest.delete(id);
    res.writeHead(success ? 204 : 404);
    res.end(success ? undefined : 'Solicitação não encontrada');
  }
};
