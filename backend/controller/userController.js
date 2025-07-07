import { User } from "../models/entities/user.js";

export const userController = {
  async getAll(req, res) {
    const users = await User.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  },

  async getById(req, res, id) {
     const user = await User.findById(id);
    if (!user) {
      res.writeHead(404);
      return res.end('Usuário não encontrado');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  },

  async create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const data = JSON.parse(body);
      const newUser = await User.create(data); // <- await aqui
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
  },

  async update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const data = JSON.parse(body);
      const updatedUser = await User.update(id, data); // <- await aqui
      if (!updatedUser) {
        res.writeHead(404);
        return res.end('Usuário não encontrado');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedUser));
    });
  },

  async delete(req, res, id) {
    const success = await User.delete(id);
    if (!success) {
      res.writeHead(404);
      return res.end('Usuário não encontrado');
    }
    res.writeHead(204);
    res.end();
  }
};
