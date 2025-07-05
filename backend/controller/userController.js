import { User } from "../models/entities/user";

export const userController = {
  getAll(req, res) {
    const users = User.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  },

  getById(req, res, id) {
    const user = User.findById(id);
    if (!user) {
      res.writeHead(404);
      return res.end('Usuário não encontrado');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  },

  create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const newUser = User.create(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
  },

  update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const updatedUser = User.update(id, data);
      if (!updatedUser) {
        res.writeHead(404);
        return res.end('Usuário não encontrado');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedUser));
    });
  },

  delete(req, res, id) {
    const success = User.delete(id);
    if (!success) {
      res.writeHead(404);
      return res.end('Usuário não encontrado');
    }
    res.writeHead(204);
    res.end();
  }
};

module.exports = userController;