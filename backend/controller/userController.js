import { User } from "../models/entities/user.js";
import { Profile } from "../models/entities/profile.js";

// Validador de dados do usuário
const validateUserData = (data, isUpdate = false) => {
  const errors = [];
  
  if (!isUpdate) {
    if (!data.name) errors.push('name is required');
    if (!data.email) errors.push('email is required');
    if (!data.password) errors.push('password is required');
  }

  if (data.name && data.name.length > 100) {
    errors.push('name must be less than 100 characters');
  }
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('email is invalid');
  }

  if (data.password && data.password.length < 6) {
    errors.push('password must be at least 6 characters');
  }

  return errors.length > 0 ? errors : null;
};

export const userController = {
  async getAll(req, res) {
    try {
      const users = await User.getAll();
      
      // Remove senhas dos resultados
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(usersWithoutPasswords));
    } catch (error) {
      console.error('Error getting users:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  },

  async getById(req, res, id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'User not found' }));
      }
      
      // Busca o perfil associado
      const profile = await Profile.findByUserId(id);
      
      // Remove a senha e adiciona o perfil
      const { password, ...userWithoutPassword } = user;
      const response = { ...userWithoutPassword, profile };
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    } catch (error) {
      console.error('Error getting user:', error);
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
        const validationErrors = validateUserData(data);
        
        if (validationErrors) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ errors: validationErrors }));
        }

        // Verifica se email já existe
        const existingUser = await User.findByEmail(data.email);
        if (existingUser) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Email already in use' }));
        }

        // Set default role if not provided
        if (!data.role) {
          data.role = 'USER';
        }

        const newUser = await User.create(data);
        
        // Remove a senha antes de retornar
        const { password, ...userWithoutPassword } = newUser;
        
        res.writeHead(201, { 
          'Content-Type': 'application/json',
          'Location': `/users/${newUser.id}`
        });
        res.end(JSON.stringify(userWithoutPassword));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        } else {
          console.error('Error creating user:', error);
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
        const validationErrors = validateUserData(data, true);
        
        if (validationErrors) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ errors: validationErrors }));
        }

        // Não permite alterar o ID
        if (data.id && data.id !== id) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'User ID cannot be changed' }));
        }

        // Verifica se o novo email já existe
        if (data.email) {
          const existingUser = await User.findByEmail(data.email);
          if (existingUser && existingUser.id !== id) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Email already in use' }));
          }
        }

        const updatedUser = await User.update(id, data);
        if (!updatedUser) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'User not found' }));
        }
        
        // Remove a senha antes de retornar
        const { password, ...userWithoutPassword } = updatedUser;
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(userWithoutPassword));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        } else {
          console.error('Error updating user:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      }
    });
  },

  async delete(req, res, id) {
    try {
      const success = await User.delete(id);
      if (!success) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'User not found' }));
      }
      
      res.writeHead(204);
      res.end();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
};