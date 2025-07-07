import { Project } from '../models/entities/project.js';
import { ImpactMetric } from '../models/entities/impactMetric.js';

const sendResponse = (res, statusCode, data = null, headers = {}) => {
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const responseHeaders = { ...defaultHeaders, ...headers };
  
  res.writeHead(statusCode, responseHeaders);
  if (data) {
    res.end(JSON.stringify(data));
  } else {
    res.end();
  }
};

const parseRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
};

const validateProjectData = (data, isUpdate = false) => {
  const errors = [];
  
  if (!isUpdate) {
    if (!data.title) errors.push('title is required');
    if (!data.description) errors.push('description is required');
    if (!data.thematicArea) errors.push('thematicArea is required');
    if (!data.category) errors.push('category is required');
  }

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
      
      if (status) {
        projects = projects.filter(p => p.status === status.toUpperCase());
      }
      
      sendResponse(res, 200, projects);
    } catch (error) {
      console.error('Error getting projects:', error);
      sendResponse(res, 500, { error: 'Internal server error' });
    }
  },

  async getById(req, res, id) {
    try {
      const project = await Project.findById(id);
      if (!project) {
        return sendResponse(res, 404, { error: 'Project not found' });
      }
      
      sendResponse(res, 200, project);
    } catch (error) {
      console.error('Error getting project:', error);
      sendResponse(res, 500, { error: 'Internal server error' });
    }
  },

  async create(req, res) {
    try {
      const data = await parseRequestBody(req);
      const validationErrors = validateProjectData(data);
      
      if (validationErrors) {
        return sendResponse(res, 400, { errors: validationErrors });
      }

      // Set default status if not provided
      const projectData = {
        ...data,
        status: data.status || 'DRAFT'
      };

      const project = await Project.create(projectData);
      
      sendResponse(res, 201, project, {
        'Location': `/projects/${project.id}`
      });
    } catch (error) {
      if (error.message === 'Invalid JSON format') {
        sendResponse(res, 400, { error: error.message });
      } else {
        console.error('Error creating project:', error);
        sendResponse(res, 500, { error: 'Internal server error' });
      }
    }
  },

  async update(req, res, id) {
    try {
      const data = await parseRequestBody(req);
      const validationErrors = validateProjectData(data, true);
      
      if (validationErrors) {
        return sendResponse(res, 400, { errors: validationErrors });
      }

      if (data.id && data.id !== id) {
        return sendResponse(res, 400, { error: 'Project ID cannot be changed' });
      }

      const updatedProject = await Project.update(id, data);
      if (!updatedProject) {
        return sendResponse(res, 404, { error: 'Project not found' });
      }
      
      sendResponse(res, 200, updatedProject);
    } catch (error) {
      if (error.message === 'Invalid JSON format') {
        sendResponse(res, 400, { error: error.message });
      } else {
        console.error('Error updating project:', error);
        sendResponse(res, 500, { error: 'Internal server error' });
      }
    }
  },

  async delete(req, res, id) {
    try {
      const success = await Project.delete(id);
      if (!success) {
        return sendResponse(res, 404, { error: 'Project not found' });
      }
      
      sendResponse(res, 204);
    } catch (error) {
      console.error('Error deleting project:', error);
      sendResponse(res, 500, { error: 'Internal server error' });
    }
  },

  async getMetrics(req, res, projectId) {
    try {
      const metrics = await ImpactMetric.findByProjectId(projectId);
      sendResponse(res, 200, metrics);
    } catch (error) {
      console.error('Error getting project metrics:', error);
      sendResponse(res, 500, { error: 'Internal server error' });
    }
  }
};