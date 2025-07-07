import { Profile } from '../models/entities/profile.js';
import { User } from '../models/entities/user.js';

const sendResponse = (res, statusCode, data = null, headers = {}) => {
  const defaultHeaders = { 'Content-Type': 'application/json' };
  res.writeHead(statusCode, { ...defaultHeaders, ...headers });
  res.end(data ? JSON.stringify(data) : undefined);
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
      return sendResponse(res, 200, profiles);
    } catch (error) {
      console.error('Error getting profiles:', error);
      return sendResponse(res, 500, { error: 'Internal server error' });
    }
  },

  async getById(req, res, id) {
    try {
      const profile = await Profile.findById(id);
      if (!profile) {
        return sendResponse(res, 404, { error: 'Profile not found' });
      }
      
      // Busca informações do usuário
      const user = await User.findById(profile.userId);
      if (user) {
        profile.user = {
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
      
      return sendResponse(res, 200, profile);
    } catch (error) {
      console.error('Error getting profile:', error);
      return sendResponse(res, 500, { error: 'Internal server error' });
    }
  },

  async getByUserId(req, res, userId) {
    try {
      const profile = await Profile.findByUserId(userId);
      if (!profile) {
        return sendResponse(res, 404, { error: 'Profile not found' });
      }
      
      return sendResponse(res, 200, profile);
    } catch (error) {
      console.error('Error getting profile by user ID:', error);
      return sendResponse(res, 500, { error: 'Internal server error' });
    }
  },

  async create(req, res) {
    try {
      const data = await parseRequestBody(req);
      
      if (!data.userId) {
        return sendResponse(res, 400, { error: 'userId is required' });
      }

      const validationErrors = validateProfileData(data);
      if (validationErrors) {
        return sendResponse(res, 400, { errors: validationErrors });
      }

      const existingProfile = await Profile.findByUserId(data.userId);
      if (existingProfile) {
        return sendResponse(res, 409, { error: 'Profile already exists for this user' });
      }

      const profile = await Profile.create(data);
      return sendResponse(res, 201, profile, {
        'Location': `/profiles/${profile.id}`
      });
    } catch (error) {
      if (error.message === 'Invalid JSON format') {
        return sendResponse(res, 400, { error: error.message });
      }
      console.error('Error creating profile:', error);
      return sendResponse(res, 500, { error: 'Internal server error' });
    }
  },

  async update(req, res, id) {
    try {
      const data = await parseRequestBody(req);
      const validationErrors = validateProfileData(data);
      
      if (validationErrors) {
        return sendResponse(res, 400, { errors: validationErrors });
      }

      if (data.userId) {
        return sendResponse(res, 400, { error: 'userId cannot be changed' });
      }

      const updatedProfile = await Profile.update(id, data);
      if (!updatedProfile) {
        return sendResponse(res, 404, { error: 'Profile not found' });
      }
      
      return sendResponse(res, 200, updatedProfile);
    } catch (error) {
      if (error.message === 'Invalid JSON format') {
        return sendResponse(res, 400, { error: error.message });
      }
      console.error('Error updating profile:', error);
      return sendResponse(res, 500, { error: 'Internal server error' });
    }
  },

  async delete(req, res, id) {
    try {
      const success = await Profile.delete(id);
      if (!success) {
        return sendResponse(res, 404, { error: 'Profile not found' });
      }
      
      return sendResponse(res, 204);
    } catch (error) {
      console.error('Error deleting profile:', error);
      return sendResponse(res, 500, { error: 'Internal server error' });
    }
  }
};