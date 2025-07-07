import { Notification } from '../models/entities/notification.js';

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
      
      // Filtros opcionais
      if (userId) {
        notifications = notifications.filter(n => n.userId === userId);
      }
      if (read) {
        const isRead = read.toLowerCase() === 'true';
        notifications = notifications.filter(n => n.read === isRead);
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(notifications));
    } catch (error) {
      console.error('Error getting notifications:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  },

  async getById(req, res, id) {
    try {
      const notification = await Notification.findById(id);
      if (!notification) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Notification not found' }));
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(notification));
    } catch (error) {
      console.error('Error getting notification:', error);
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
        const validationErrors = validateNotificationData(data);
        
        if (validationErrors) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ errors: validationErrors }));
        }

        // Set default values
        if (typeof data.read === 'undefined') {
          data.read = false;
        }
        if (!data.createdAt) {
          data.createdAt = new Date().toISOString();
        }

        const notification = await Notification.create(data);
        
        res.writeHead(201, { 
          'Content-Type': 'application/json',
          'Location': `/notifications/${notification.id}`
        });
        res.end(JSON.stringify(notification));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        } else {
          console.error('Error creating notification:', error);
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
        
        // Não permite alterar o userId
        if (data.userId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'userId cannot be changed' }));
        }

        const updatedNotification = await Notification.update(id, data);
        if (!updatedNotification) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Notification not found' }));
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedNotification));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        } else {
          console.error('Error updating notification:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      }
    });
  },

  async markAsRead(req, res, id) {
    try {
      const updated = await Notification.update(id, { read: true });
      if (!updated) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Notification not found' }));
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  },

  async delete(req, res, id) {
    try {
      const success = await Notification.delete(id);
      if (!success) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Notification not found' }));
      }
      
      res.writeHead(204);
      res.end();
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
};