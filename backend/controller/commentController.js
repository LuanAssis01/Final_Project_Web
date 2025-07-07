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

  async update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const updatedComment = await Comment.update(id, data);
        if (!updatedComment) {
          res.writeHead(404);
          return res.end('Comment not found');
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedComment));
      } catch (error) {
        console.error('Error updating comment:', error);
        res.writeHead(500);
        res.end('Internal server error');
      }
    });
  },

  async delete(req, res, id) {
    try {
      const success = await Comment.delete(id);
      if (!success) {
        res.writeHead(404);
        return res.end('Comment not found');
      }
      res.writeHead(204);
      res.end();
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.writeHead(500);
      res.end('Internal server error');
    }
  },

  async getByProjectId(req, res, projectId) {
    try {
      const comments = await Comment.findByProjectId(projectId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(comments));
    } catch (error) {
      console.error('Error getting comments by projectId:', error);
      res.writeHead(500);
      res.end('Internal server error');
    }
  },

  async addReply(req, res, commentId) {
    let body = '';
    req.on('data', chunk => body += chunk);

    req.on('end', async () => {
      try {
        const replyData = JSON.parse(body);
        const reply = await Comment.addReply(commentId, replyData);
        if (!reply) {
          res.writeHead(404);
          return res.end('Comment not found');
        }
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(reply));
      } catch (error) {
        console.error('Error adding reply:', error);
        res.writeHead(500);
        res.end('Internal server error');
      }
    });
  },

  async toggleLike(req, res, commentId, userId) {
    try {
      const updatedComment = await Comment.toggleLike(commentId, userId);
      if (!updatedComment) {
        res.writeHead(404);
        return res.end('Comment not found');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedComment));
    } catch (error) {
      console.error('Error toggling like:', error);
      res.writeHead(500);
      res.end('Internal server error');
    }
  }
};