import { Attachment } from '../models/entities/attachment.js';

export const attachmentController = {
  async getAll(req, res) {
    const attachments = await Attachment.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(attachments));
  },

  async getById(req, res, id) {
    const attachment = await Attachment.findById(id);
    if (!attachment) {
      res.writeHead(404);
      return res.end('Anexo não encontrado');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(attachment));
  },

  async create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const data = JSON.parse(body);
      const attachment = await Attachment.create(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(attachment));
    });
  },

  async update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const data = JSON.parse(body);
      const updated = await Attachment.update(id, data);
      if (!updated) {
        res.writeHead(404);
        return res.end('Anexo não encontrado');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    });
  },

  async delete(req, res, id) {
    const success = await Attachment.delete(id);
    res.writeHead(success ? 204 : 404);
    res.end(success ? undefined : 'Anexo não encontrado');
  }
};
