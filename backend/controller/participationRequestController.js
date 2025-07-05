import { ParticipationRequest } from '../models/entities/participationRequest.js';

export const participationRequestController = {
  getAll(req, res) {
    const requests = ParticipationRequest.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(requests));
  },

  getById(req, res, id) {
    const request = ParticipationRequest.findById(id);
    if (!request) {
      res.writeHead(404);
      return res.end('Solicitação não encontrada');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(request));
  },

  create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const request = ParticipationRequest.create(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(request));
    });
  },

  update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const updated = ParticipationRequest.update(id, data);
      if (!updated) {
        res.writeHead(404);
        return res.end('Solicitação não encontrada');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    });
  },

  delete(req, res, id) {
    const success = ParticipationRequest.delete(id);
    res.writeHead(success ? 204 : 404);
    res.end(success ? undefined : 'Solicitação não encontrada');
  }
};
