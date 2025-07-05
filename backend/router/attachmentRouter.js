import { attachmentController } from '../controller/attachmentController';

export function attachmentRouter(req, res){
    const urlParts = req.url.split('/');
      const id = urlParts[3];
    
      if (req.method === 'GET' && urlParts.length === 3) {
        return attachmentController.getAll(req, res);
      }
    
      if (req.method === 'GET' && id) {
        return attachmentController.getById(req, res, id);
      }
    
      if (req.method === 'POST') {
        return attachmentController.create(req, res);
      }
    
      if (req.method === 'PUT' && id) {
        return attachmentController.update(req, res, id);
      }
    
      if (req.method === 'DELETE' && id) {
        return attachmentController.delete(id, res);
      }
    
      res.writeHead(405);
      res.end('Método não permitido');
}