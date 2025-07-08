import { Notification } from '../models/entities/notification.js';

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

const validateNotificationData = (data) => {
  const errors = [];
  
  if (!data.userId) errors.push('userId is required');
  if (!data.message) errors.push('message is required');
  if (data.message && data.message.length > 500) {
    errors.push('message must be less than 500 characters');
  }
  
  return errors.length > 0 ? errors : null;
};

export const notificationController = {
  async getAll(req, res) {
    try {
      const { userId, read } = req.query;
      let notifications = await Notification.getAll();
      
      // Aplicar filtros
      if (userId) {
        notifications = notifications.filter(n => n.userId === userId);
      }
      if (read) {
        const isRead = read.toLowerCase() === 'true';
        notifications = notifications.filter(n => n.read === isRead);
      }
      
      return sendResponse(res, 200, notifications);
    } catch (error) {
      console.error('Error getting notifications:', error);
      return sendResponse(res, 500, { error: 'Internal server error' });
    }
  },

  async getById(req, res, id) {
    try {
      const notification = await Notification.findById(id);
      if (!notification) {
        return sendResponse(res, 404, { error: 'Notification not found' });
      }
      
      return sendResponse(res, 200, notification);
    } catch (error) {
      console.error('Error getting notification:', error);
      return sendResponse(res, 500, { error: 'Internal server error' });
    }
  },

  async create(req, res) {
    try {
      const data = await parseRequestBody(req);
      const validationErrors = validateNotificationData(data);
      
      if (validationErrors) {
        return sendResponse(res, 400, { errors: validationErrors });
      }

      // Set default values
      const notificationData = {
        ...data,
        read: data.read || false,
        createdAt: data.createdAt || new Date().toISOString()
      };

      const notification = await Notification.create(notificationData);
      
      return sendResponse(res, 201, notification, {
        'Location': `/notifications/${notification.id}`
      });
    } catch (error) {
      if (error.message === 'Invalid JSON format') {
        return sendResponse(res, 400, { error: error.message });
      }
      console.error('Error creating notification:', error);
      return sendResponse(res, 500, { error: 'Internal server error' });
    }
  },

  async update(req, res, id) {
    try {
      const data = await parseRequestBody(req);
      
      // Não permite alterar o userId
      if (data.userId) {
        return sendResponse(res, 400, { error: 'userId cannot be changed' });
      }

      const updatedNotification = await Notification.update(id, data);
      if (!updatedNotification) {
        return sendResponse(res, 404, { error: 'Notification not found' });
      }
      
      return sendResponse(res, 200, updatedNotification);
    } catch (error) {
      if (error.message === 'Invalid JSON format') {
        return sendResponse(res, 400, { error: error.message });
      }
      console.error('Error updating notification:', error);
      return sendResponse(res, 500, { error: 'Internal server error' });
    }
  },

  async markAsRead(req, res, id) {
    try {
      const updated = await Notification.update(id, { read: true });
      if (!updated) {
        return sendResponse(res, 404, { error: 'Notification not found' });
      }
      
      return sendResponse(res, 200, updated);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return sendResponse(res, 500, { error: 'Internal server error' });
    }
  },

  async markAllAsRead(req, res) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return sendResponse(res, 400, { error: 'userId query parameter is required' });
      }

      const success = await Notification.markAllAsRead(userId);
      if (!success) {
        return sendResponse(res, 404, { error: 'No notifications found for this user' });
      }
      
      return sendResponse(res, 200, { message: 'All notifications marked as read' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return sendResponse(res, 500, { error: 'Internal server error' });
    }
  },

  async delete(req, res, id) {
    try {
      const success = await Notification.delete(id);
      if (!success) {
        return sendResponse(res, 404, { error: 'Notification not found' });
      }
      
      return sendResponse(res, 204);
    } catch (error) {
      console.error('Error deleting notification:', error);
      return sendResponse(res, 500, { error: 'Internal server error' });
    }
  }
};