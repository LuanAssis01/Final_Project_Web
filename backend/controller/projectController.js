import { Project } from '../models/entities/project.js';

export const projectController = {
  getAll(req, res) {
    const projects = Project.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(projects));
  },

  getById(req, res, id) {
    const project = Project.findById(id);
    if (!project) {
      res.writeHead(404);
      return res.end('Projeto não encontrado');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(project));
  },

  create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const project = Project.create(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(project));
    });
  },

  update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const updated = Project.update(id, data);
      if (!updated) {
        res.writeHead(404);
        return res.end('Projeto não encontrado');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    });
  },

  delete(req, res, id) {
    const success = Project.delete(id);
    res.writeHead(success ? 204 : 404);
    res.end(success ? undefined : 'Projeto não encontrado');
  }
};
