import { Project } from '../models/entities/project.js';

// Validador de dados do projeto
const validateProjectData = (data, isUpdate = false) => {
  const errors = [];
  
  // Campos obrigatórios apenas para criação
  if (!isUpdate) {
    if (!data.title) errors.push('title is required');
    if (!data.description) errors.push('description is required');
    if (!data.thematicArea) errors.push('thematicArea is required');
    if (!data.category) errors.push('category is required');
  }

  // Validações para ambos criação e atualização
  if (data.title && data.title.length > 100) {
    errors.push('title must be less than 100 characters');
  }
  
  if (data.description && data.description.length > 2000) {
    errors.push('description must be less than 2000 characters');
  }

  return errors.length > 0 ? errors : null;
};

export const projectController = {
  async getAll(req, res) {
    try {
      const { status } = req.query;
      let projects = await Project.getAll();
      
      // Filtro opcional por status
      if (status) {
        projects = projects.filter(p => p.status === status.toUpperCase());
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(projects));
    } catch (error) {
      console.error('Error getting projects:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  },

  async getById(req, res, id) {
    try {
      const project = await Project.findById(id);
      if (!project) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Project not found' }));
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(project));
    } catch (error) {
      console.error('Error getting project:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  },

  async create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const validationErrors = validateProjectData(data);
        
        if (validationErrors) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ errors: validationErrors }));
        }

        // Set default status if not provided
        if (!data.status) {
          data.status = 'DRAFT';
        }

        const project = await Project.create(data);
        
        res.writeHead(201, { 
          'Content-Type': 'application/json',
          'Location': `/projects/${project.id}`
        });
        res.end(JSON.stringify(project));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        } else {
          console.error('Error creating project:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      }
    });
  },

  async update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const validationErrors = validateProjectData(data, true);
        
        if (validationErrors) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ errors: validationErrors }));
        }

        // Prevent changing the ID
        if (data.id && data.id !== id) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Project ID cannot be changed' }));
        }

        const updatedProject = await Project.update(id, data);
        if (!updatedProject) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Project not found' }));
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedProject));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        } else {
          console.error('Error updating project:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      }
    });
  },

  async delete(req, res, id) {
    try {
      const success = await Project.delete(id);
      if (!success) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Project not found' }));
      }
      
      res.writeHead(204);
      res.end();
    } catch (error) {
      console.error('Error deleting project:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  },

  async getMetrics(req, res, projectId) {
    try {
      const metrics = await ImpactMetric.findByProjectId(projectId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(metrics));
    } catch (error) {
      console.error('Error getting project metrics:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
};