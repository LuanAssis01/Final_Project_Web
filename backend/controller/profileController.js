import { Profile } from '../models/entities/profile.js';
import { User } from '../models/entities/user.js';

// Validador de dados do perfil
const validateProfileData = (data) => {
  const errors = [];
  
  if (data.bio && data.bio.length > 500) {
    errors.push('bio must be less than 500 characters');
  }
  
  if (data.institution && data.institution.length > 100) {
    errors.push('institution must be less than 100 characters');
  }

  return errors.length > 0 ? errors : null;
};

export const profileController = {
  async getAll(req, res) {
    try {
      const profiles = await Profile.getAll();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(profiles));
    } catch (error) {
      console.error('Error getting profiles:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  },

  async getById(req, res, id) {
    try {
      const profile = await Profile.findById(id);
      if (!profile) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Profile not found' }));
      }
      
      // Busca informações básicas do usuário associado
      const user = await User.findById(profile.userId);
      if (user) {
        profile.user = {
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(profile));
    } catch (error) {
      console.error('Error getting profile:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  },

  async getByUserId(req, res, userId) {
    try {
      const profile = await Profile.findByUserId(userId);
      if (!profile) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Profile not found' }));
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(profile));
    } catch (error) {
      console.error('Error getting profile by user ID:', error);
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
        
        if (!data.userId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'userId is required' }));
        }

        const validationErrors = validateProfileData(data);
        if (validationErrors) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ errors: validationErrors }));
        }

        // Verifica se já existe perfil para este usuário
        const existingProfile = await Profile.findByUserId(data.userId);
        if (existingProfile) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Profile already exists for this user' }));
        }

        const profile = await Profile.create(data);
        
        res.writeHead(201, { 
          'Content-Type': 'application/json',
          'Location': `/profiles/${profile.id}`
        });
        res.end(JSON.stringify(profile));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        } else {
          console.error('Error creating profile:', error);
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
        const validationErrors = validateProfileData(data);
        
        if (validationErrors) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ errors: validationErrors }));
        }

        // Não permite alterar o userId
        if (data.userId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'userId cannot be changed' }));
        }

        const updatedProfile = await Profile.update(id, data);
        if (!updatedProfile) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Profile not found' }));
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedProfile));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        } else {
          console.error('Error updating profile:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      }
    });
  },

  async delete(req, res, id) {
    try {
      const success = await Profile.delete(id);
      if (!success) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Profile not found' }));
      }
      
      res.writeHead(204);
      res.end();
    } catch (error) {
      console.error('Error deleting profile:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
};