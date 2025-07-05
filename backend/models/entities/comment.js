import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../../../data/comments.json');

export class Comment {
  constructor(projectId, userId, text, createdAt) {
    this.id = randomUUID();
    this.projectId = projectId;
    this.userId = userId;
    this.text = text;
    this.createdAt = createdAt;
  }

  static getAll() {
    if (!fs.existsSync(DATA_PATH)) return [];
    const data = fs.readFileSync(DATA_PATH);
    return JSON.parse(data);
  }

  static saveAll(comments) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(comments, null, 2));
  }

  static findById(id) {
    return this.getAll().find(c => c.id === id);
  }

  static create(data) {
    const comments = this.getAll();
    const comment = new Comment(data.projectId, data.userId, data.text, data.createdAt);
    comments.push(comment);
    this.saveAll(comments);
    return comment;
  }

  static update(id, updatedData) {
    const comments = this.getAll();
    const index = comments.findIndex(c => c.id === id);
    if (index === -1) return null;
    comments[index] = { ...comments[index], ...updatedData };
    this.saveAll(comments);
    return comments[index];
  }

  static delete(id) {
    let comments = this.getAll();
    const originalLength = comments.length;
    comments = comments.filter(c => c.id !== id);
    if (comments.length === originalLength) return false;
    this.saveAll(comments);
    return true;
  }
}
