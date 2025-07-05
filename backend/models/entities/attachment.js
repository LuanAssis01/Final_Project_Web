import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '../../data/attachments.json');

if (!fs.existsSync(DATA_PATH)) {
  fs.writeFileSync(DATA_PATH, '[]', 'utf-8');
}

export class Attachment {
  constructor(projectId, filename, url) {
    this.id = randomUUID();
    this.projectId = projectId;
    this.filename = filename;
    this.url = url;
  }

  static getAll() {
    if (!fs.existsSync(DATA_PATH)) return [];
    const data = fs.readFileSync(DATA_PATH);
    return JSON.parse(data);
  }

  static saveAll(attachments) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(attachments, null, 2));
  }

  static findById(id) {
    return this.getAll().find(a => a.id === id);
  }

  static create(data) {
    const attachments = this.getAll();
    const attachment = new Attachment(data.projectId, data.filename, data.url);
    attachments.push(attachment);
    this.saveAll(attachments);
    return attachment;
  }

  static update(id, updatedData) {
    const attachments = this.getAll();
    const index = attachments.findIndex(a => a.id === id);
    if (index === -1) return null;
    attachments[index] = { ...attachments[index], ...updatedData };
    this.saveAll(attachments);
    return attachments[index];
  }

  static delete(id) {
    let attachments = this.getAll();
    const originalLength = attachments.length;
    attachments = attachments.filter(a => a.id !== id);
    if (attachments.length === originalLength) return false;
    this.saveAll(attachments);
    return true;
  }
}
