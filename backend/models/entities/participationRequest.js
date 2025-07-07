import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '../../data/participationRequests.json');

const ensureFileExists = async () => {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, '[]', 'utf-8');
  }
};

await ensureFileExists();

export class ParticipationRequest {
  constructor(projectId, userId, requestedAt, status = 'PENDING') {
    this.id = randomUUID();
    this.projectId = projectId;
    this.userId = userId;
    this.requestedAt = requestedAt;
    this.status = status;
    this.processedAt = null; // Adicionado campo para rastrear quando foi processado
    this.processedBy = null; // Adicionado campo para rastrear quem processou
  }

  static async getAll() {
    try {
      const data = await fs.readFile(DATA_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  static async saveAll(requests) {
    await fs.writeFile(DATA_PATH, JSON.stringify(requests, null, 2));
  }

  static async findById(id) {
    const requests = await this.getAll();
    return requests.find(r => r.id === id);
  }

  static async findByProjectId(projectId) {
    const requests = await this.getAll();
    return requests.filter(r => r.projectId === projectId);
  }

  static async findByUserId(userId) {
    const requests = await this.getAll();
    return requests.filter(r => r.userId === userId);
  }

  static async create(data) {
    const requests = await this.getAll();
    const newRequest = new ParticipationRequest(
      data.projectId,
      data.userId,
      data.requestedAt || new Date().toISOString(), // Data atual se não for fornecida
      data.status
    );
    requests.push(newRequest);
    await this.saveAll(requests);
    return newRequest;
  }

  static async update(id, updatedData) {
    const requests = await this.getAll();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    // Se o status está sendo atualizado, registra quando e por quem (se aplicável)
    if (updatedData.status && updatedData.status !== requests[index].status) {
      updatedData.processedAt = new Date().toISOString();
      if (updatedData.processedBy) {
        updatedData.processedBy = updatedData.processedBy;
      }
    }
    
    requests[index] = { ...requests[index], ...updatedData };
    await this.saveAll(requests);
    return requests[index];
  }

  static async delete(id) {
    const requests = await this.getAll();
    const originalLength = requests.length;
    const filteredRequests = requests.filter(r => r.id !== id);
    
    if (filteredRequests.length === originalLength) {
      return false;
    }
    
    await this.saveAll(filteredRequests);
    return true;
  }

  static async changeStatus(id, newStatus, processedBy = null) {
    return this.update(id, {
      status: newStatus,
      processedAt: new Date().toISOString(),
      processedBy
    });
  }
}