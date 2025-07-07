import { commentController } from '../controller/commentController.js';

export function commentRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');
  const id = urlParts[1];
  const action = urlParts[2];
  const projectId = urlParts[3]; 

  try {
    if (req.method === 'GET') {
      if (urlParts.length === 1 && !id) {
        return commentController.getAll(req, res);
      }
      if (id && urlParts.length === 2) {
        return commentController.getById(req, res, id);
      }
      if (urlParts[0] === 'project' && projectId) {
        if (urlParts[2] === 'count') {
          return commentController.getCommentCount(req, res, projectId);
        }
      }
    }

    if (req.method === 'POST') {
      if (urlParts.length === 1) {
        return commentController.create(req, res);
      }
      if (id && action === 'reply') {
        return commentController.addReply(req, res, id);
      }
    }

    if (req.method === 'PUT') {
      if (id && urlParts.length === 2) {
        return commentController.update(req, res, id);
      }
      if (id && action === 'like') {
        const userId = urlParts[3]; // /comments/:id/like/:userId
        return commentController.toggleLike(req, res, id, userId);
      }
    }

    if (req.method === 'DELETE' && id && urlParts.length === 2) {
      return commentController.delete(req, res, id);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de comentários:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}