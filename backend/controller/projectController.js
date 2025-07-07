import { Project } from '../models/entities/project.js';

export const projectController = {
  async getAll(req, res) {
    const projects = await Project.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(projects));
  },

  async getById(req, res, id) {
    const project = await Project.findById(id);
    if (!project) {
      res.writeHead(404);
      return res.end('Projeto não encontrado');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(project));
  },

  async create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const data = JSON.parse(body);
      const project = await Project.create(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(project));
    });
  },

  async update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const data = JSON.parse(body);
      const updated = await Project.update(id, data);
      if (!updated) {
        res.writeHead(404);
        return res.end('Projeto não encontrado');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    });
  },

  async delete(req, res, id) {
    const success = await Project.delete(id);
    res.writeHead(success ? 204 : 404);
    res.end(success ? undefined : 'Projeto não encontrado');
  }
};
