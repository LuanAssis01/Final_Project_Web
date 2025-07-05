import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../../../data/participationRequests.json');

export class ParticipationRequest {
  constructor(projectId, userId, requestedAt, status = 'PENDING') {
    this.id = randomUUID();
    this.projectId = projectId;
    this.userId = userId;
    this.requestedAt = requestedAt;
    this.status = status;
  }

  static getAll() {
    if (!fs.existsSync(DATA_PATH)) return [];
    const data = fs.readFileSync(DATA_PATH);
    return JSON.parse(data);
  }

  static saveAll(requests) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(requests, null, 2));
  }

  static findById(id) {
    return this.getAll().find(r => r.id === id);
  }

  static create(data) {
    const requests = this.getAll();
    const newRequest = new ParticipationRequest(data.projectId, data.userId, data.requestedAt, data.status);
    requests.push(newRequest);
    this.saveAll(requests);
    return newRequest;
  }

  static update(id, updatedData) {
    const requests = this.getAll();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) return null;
    requests[index] = { ...requests[index], ...updatedData };
    this.saveAll(requests);
    return requests[index];
  }

  static delete(id) {
    let requests = this.getAll();
    const originalLength = requests.length;
    requests = requests.filter(r => r.id !== id);
    if (requests.length === originalLength) return false;
    this.saveAll(requests);
    return true;
  }
}
