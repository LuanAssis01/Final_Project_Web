import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../../../data/impactMetrics.json');

export class ImpactMetric {
  constructor(projectId, name, value, measuredAt) {
    this.id = randomUUID();
    this.projectId = projectId;
    this.name = name;
    this.value = value;
    this.measuredAt = measuredAt;
  }

  static getAll() {
    if (!fs.existsSync(DATA_PATH)) return [];
    const data = fs.readFileSync(DATA_PATH);
    return JSON.parse(data);
  }

  static saveAll(metrics) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(metrics, null, 2));
  }

  static findById(id) {
    return this.getAll().find(m => m.id === id);
  }

  static create(data) {
    const metrics = this.getAll();
    const metric = new ImpactMetric(data.projectId, data.name, data.value, data.measuredAt);
    metrics.push(metric);
    this.saveAll(metrics);
    return metric;
  }

  static update(id, updatedData) {
    const metrics = this.getAll();
    const index = metrics.findIndex(m => m.id === id);
    if (index === -1) return null;
    metrics[index] = { ...metrics[index], ...updatedData };
    this.saveAll(metrics);
    return metrics[index];
  }

  static delete(id) {
    let metrics = this.getAll();
    const originalLength = metrics.length;
    metrics = metrics.filter(m => m.id !== id);
    if (metrics.length === originalLength) return false;
    this.saveAll(metrics);
    return true;
  }
}
