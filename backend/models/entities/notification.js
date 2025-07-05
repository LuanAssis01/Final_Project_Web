import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../../../data/notifications.json');

export class Notification {
  constructor(userId, message, sentAt, read = false) {
    this.id = randomUUID();
    this.userId = userId;
    this.message = message;
    this.sentAt = sentAt;
    this.read = read;
  }

  static getAll() {
    if (!fs.existsSync(DATA_PATH)) return [];
    const data = fs.readFileSync(DATA_PATH);
    return JSON.parse(data);
  }

  static saveAll(notifications) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(notifications, null, 2));
  }

  static findById(id) {
    return this.getAll().find(n => n.id === id);
  }

  static create(data) {
    const notifications = this.getAll();
    const notification = new Notification(data.userId, data.message, data.sentAt, data.read);
    notifications.push(notification);
    this.saveAll(notifications);
    return notification;
  }

  static update(id, updatedData) {
    const notifications = this.getAll();
    const index = notifications.findIndex(n => n.id === id);
    if (index === -1) return null;
    notifications[index] = { ...notifications[index], ...updatedData };
    this.saveAll(notifications);
    return notifications[index];
  }

  static delete(id) {
    let notifications = this.getAll();
    const originalLength = notifications.length;
    notifications = notifications.filter(n => n.id !== id);
    if (notifications.length === originalLength) return false;
    this.saveAll(notifications);
    return true;
  }
}
