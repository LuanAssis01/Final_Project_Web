import { Profile } from '../models/entities/profile.js';

export const profileController = {
  getAll(req, res) {
    const profiles = Profile.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(profiles));
  },

  getById(req, res, id) {
    const profile = Profile.findById(id);
    if (!profile) {
      res.writeHead(404);
      return res.end('Perfil não encontrado');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(profile));
  },

  create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const profile = Profile.create(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(profile));
    });
  },

  update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const updated = Profile.update(id, data);
      if (!updated) {
        res.writeHead(404);
        return res.end('Perfil não encontrado');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    });
  },

  delete(req, res, id) {
    const success = Profile.delete(id);
    res.writeHead(success ? 204 : 404);
    res.end(success ? undefined : 'Perfil não encontrado');
  }
};
