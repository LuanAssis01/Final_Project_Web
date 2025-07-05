// controller/commentController.js
import { Comment } from '../models/entities/comment.js';

export const commentController = {
  getAll(req, res) {
    const comments = Comment.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(comments));
  },

  getById(req, res, id) {
    const comment = Comment.findById(id);
    if (!comment) {
      res.writeHead(404);
      return res.end('Comentário não encontrado');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(comment));
  },

  create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const comment = Comment.create(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(comment));
    });
  },

  update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const updated = Comment.update(id, data);
      if (!updated) {
        res.writeHead(404);
        return res.end('Comentário não encontrado');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    });
  },

  delete(req, res, id) {
    const success = Comment.delete(id);
    res.writeHead(success ? 204 : 404);
    res.end(success ? undefined : 'Comentário não encontrado');
  }
};
