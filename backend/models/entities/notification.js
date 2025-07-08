// Refatorado para async/await com fs.promises — Model: Notification

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises'; 
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '../../data/notification.json');

const ensureFileExists = async () => {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, '[]', 'utf-8');
  }
};

await ensureFileExists();

export class Notification {
  constructor({ userId, message, sentAt = new Date().toISOString(), read = false }) {
    this.id = randomUUID();
    this.userId = userId;
    this.message = message;
    this.read = read;
    this.sentAt = sentAt;
  }

  static async getAll() {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  }

  static async saveAll(notifications) {
    await fs.writeFile(DATA_PATH, JSON.stringify(notifications, null, 2));
  }

  static async findById(id) {
    const notifications = await this.getAll();
    return notifications.find(n => n.id === id);
  }

  static async create(data) {
    const notifications = await this.getAll();
    const newNotification = new Notification(data);
    notifications.push(newNotification);
    await this.saveAll(notifications);
    return newNotification;
  }

  static async update(id, updatedData) {
    const notifications = await this.getAll();
    const index = notifications.findIndex(n => n.id === id);
    if (index === -1) return null;
    notifications[index] = { ...notifications[index], ...updatedData };
    await this.saveAll(notifications);
    return notifications[index];
  }

  static async delete(id) {
    const notifications = await this.getAll();
    const filtered = notifications.filter(n => n.id !== id);
    if (filtered.length === notifications.length) return false;
    await this.saveAll(filtered);
    return true;
  }
}
