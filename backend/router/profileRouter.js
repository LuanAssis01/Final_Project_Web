import { profileController } from '../controller/profileController.js';

export function profileRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');
  const id = urlParts[1];
  const userId = urlParts[3]; // Para rotas de usuário

  try {
    if (req.method === 'GET') {
      if (urlParts.length === 1 && !id) {
        return profileController.getAll(req, res);
      }
      if (id && urlParts.length === 2) {
        return profileController.getById(req, res, id);
      }
      if (urlParts[0] === 'user' && userId) {
        return profileController.getByUserId(req, res, userId);
      }
    }

    if (req.method === 'POST') {
      if (urlParts.length === 1) {
        return profileController.create(req, res);
      }
    }

    if (req.method === 'PUT' && id && urlParts.length === 2) {
      return profileController.update(req, res, id);
    }

    if (req.method === 'DELETE' && id && urlParts.length === 2) {
      return profileController.delete(req, res, id);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de perfis:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}