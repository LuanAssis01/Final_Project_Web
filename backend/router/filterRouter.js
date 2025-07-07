import { Filter } from '../models/entities/filter.js';
import { Project } from '../models/entities/project.js';
import { URL } from 'url';

export function filterRouter(req, res) {
  try {
    if (req.method !== 'GET') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Método não permitido' }));
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const filters = {
      area: url.searchParams.get('area'),
      category: url.searchParams.get('category'),
      location: url.searchParams.get('location'),
      status: url.searchParams.get('status'),
      search: url.searchParams.get('search')
    };

    const projects = Project.getAll();
    const result = Filter.apply(projects, filters);

    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'X-Total-Count': result.length
    });
    res.end(JSON.stringify(result));
  } catch (error) {
    console.error('Erro no router de filtros:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
  }
}