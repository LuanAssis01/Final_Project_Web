// router/commentRouter.js
import { commentController } from '../controller/commentController.js';

export function commentRouter(req, res) {
  const urlParts = req.url.split('/').filter(p => p !== '');
  const [_, resource, param1, param2] = urlParts;

  try {
    if (req.method === 'POST' && resource === 'comments' && !param1) {
      return commentController.create(req, res);
    }

    if (req.method === 'GET' && resource === 'comments' && !param1) {
      return commentController.getAll(req, res);
    }

    if (req.method === 'GET' && resource === 'comments' && param1 && !param2) {
      return commentController.getById(req, res, param1);
    }

    if (req.method === 'PUT' && resource === 'comments' && param1 && !param2) {
      return commentController.update(req, res, param1);
    }

    if (req.method === 'DELETE' && resource === 'comments' && param1 && !param2) {
      return commentController.delete(req, res, param1);
    }

    if (req.method === 'GET' && resource === 'comments' && param1 === 'project' && param2) {
      return commentController.getByProjectId(req, res, param2);
    }

    if (req.method === 'POST' && resource === 'comments' && param2 === 'reply') {
      return commentController.addReply(req, res, param1);
    }

    if (req.method === 'PUT' && resource === 'comments' && param2 === 'like') {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const userId = url.searchParams.get('userId');
      return commentController.toggleLike(req, res, param1, userId);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de comentários:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}
