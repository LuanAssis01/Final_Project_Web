import { Notification } from '../models/entities/notification.js';

export const notificationController = {
  async getAll(req, res) {
    const notifications = await Notification.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(notifications));
  },

  async getById(req, res, id) {
    const notification = await Notification.findById(id);
    if (!notification) {
      res.writeHead(404);
      return res.end('Notificação não encontrada');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(notification));
  },

  async create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const data = JSON.parse(body);
      const notification = await Notification.create(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(notification));
    });
  },

  async update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const data = JSON.parse(body);
      const updated = await Notification.update(id, data);
      if (!updated) {
        res.writeHead(404);
        return res.end('Notificação não encontrada');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    });
  },

  async delete(req, res, id) {
    const success = await Notification.delete(id);
    res.writeHead(success ? 204 : 404);
    res.end(success ? undefined : 'Notificação não encontrada');
  }
};
