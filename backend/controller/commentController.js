// controller/commentController.js
import { Comment } from '../models/entities/comment.js';

export const commentController = {
  async getAll(req, res) {
    const comments = await Comment.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(comments));
  },

  async getById(req, res, id) {
    const comment = await Comment.findById(id);
    if (!comment) {
      res.writeHead(404);
      return res.end('Comentário não encontrado');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(comment));
  },

  async create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const data = JSON.parse(body);
      const comment = await Comment.create(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(comment));
    });
  },

  async update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const data = JSON.parse(body);
      const updated = await Comment.update(id, data);
      if (!updated) {
        res.writeHead(404);
        return res.end('Comentário não encontrado');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    });
  },

  async delete(req, res, id) {
    const success = await Comment.delete(id);
    res.writeHead(success ? 204 : 404);
    res.end(success ? undefined : 'Comentário não encontrado');
  }
};
