import { profileController } from '../controller/profileController.js';

export function profileRouter(req, res) {
  const urlParts = req.url.split('/').filter(part => part !== '');
  const [_, resource, param1, param2] = urlParts;

  try {
    if (req.method === 'GET' && resource === 'profiles' && !param1) {
      return profileController.getAll(req, res);
    }

    if (req.method === 'GET' && resource === 'profiles' && param1 && !param2) {
      return profileController.getById(req, res, param1);
    }

    if (req.method === 'GET' && resource === 'profiles' && param1 === 'user' && param2) {
      return profileController.getByUserId(req, res, param2);
    }

    if (req.method === 'POST' && resource === 'profiles' && !param1) {
      return profileController.create(req, res);
    }

    if (req.method === 'PUT' && resource === 'profiles' && param1 && !param2) {
      return profileController.update(req, res, param1);
    }

    if (req.method === 'DELETE' && resource === 'profiles' && param1 && !param2) {
      return profileController.delete(req, res, param1);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro no router de perfis:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}