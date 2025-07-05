import { Filter } from '../models/entities/filter.js';
import { Project } from '../models/entities/project.js';
import { URL } from 'url';

export function filterRouter(req, res) {
  if (req.method !== 'GET') {
    res.writeHead(405);
    return res.end('Método não permitido');
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const filters = {
    area: url.searchParams.get('area'),
    category: url.searchParams.get('category'),
    location: url.searchParams.get('location'),
    status: url.searchParams.get('status'),
  };

  const projects = Project.getAll();
  const result = Filter.apply(projects, filters);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(result));
}
