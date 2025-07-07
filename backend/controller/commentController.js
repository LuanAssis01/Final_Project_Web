import { Comment } from '../models/entities/comment.js';

export const commentController = {
  async getAll(req, res) {
    try {
      const comments = await Comment.getAll();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(comments));
    } catch (error) {
      console.error('Error getting comments:', error);
      res.writeHead(500);
      res.end('Internal server error');
    }
  },

  async getById(req, res, id) {
    try {
      const comment = await Comment.findById(id);
      if (!comment) {
        res.writeHead(404);
        return res.end('Comment not found');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(comment));
    } catch (error) {
      console.error('Error getting comment:', error);
      res.writeHead(500);
      res.end('Internal server error');
    }
  },

  async create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        
        if (!data.projectId || !data.userId || !data.text) {
          res.writeHead(400);
          return res.end('projectId, userId and text are required');
        }

        const newComment = await Comment.create(data);
        res.writeHead(201, { 
          'Content-Type': 'application/json',
          'Location': `/comments/${newComment.id}`
        });
        res.end(JSON.stringify(newComment));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400);
          res.end('Invalid JSON');
        } else {
          console.error('Error creating comment:', error);
          res.writeHead(500);
          res.end('Internal server error');
        }
      }
    });
  },

  // ... outros métodos com o mesmo padrão de melhoria
};