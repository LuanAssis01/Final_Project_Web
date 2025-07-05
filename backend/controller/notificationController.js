import { Notification } from '../models/entities/notification.js';

export const notificationController = {
  getAll(req, res) {
    const notifications = Notification.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(notifications));
  },

  getById(req, res, id) {
    const notification = Notification.findById(id);
    if (!notification) {
      res.writeHead(404);
      return res.end('Notificação não encontrada');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(notification));
  },

  create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const notification = Notification.create(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(notification));
    });
  },

  update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const updated = Notification.update(id, data);
      if (!updated) {
        res.writeHead(404);
        return res.end('Notificação não encontrada');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    });
  },

  delete(req, res, id) {
    const success = Notification.delete(id);
    res.writeHead(success ? 204 : 404);
    res.end(success ? undefined : 'Notificação não encontrada');
  }
};
