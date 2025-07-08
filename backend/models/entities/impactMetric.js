import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '../../data/impactMetrics.json');

const ensureFileExists = async () => {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, '[]', 'utf-8');
  }
};

await ensureFileExists();

export class ImpactMetric {
  constructor(projectId, name, value, measuredAt = new Date().toISOString()) {
    this.id = randomUUID();
    this.projectId = projectId;
    this.name = name;
    this.value = value;
    this.measuredAt = measuredAt;
    this.lastUpdated = new Date().toISOString();
  }

  static async getAll() {
    try {
      const data = await fs.readFile(DATA_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading metrics file:', err);
      return [];
    }
  }

  static async saveAll(metrics) {
    try {
      await fs.writeFile(DATA_PATH, JSON.stringify(metrics, null, 2));
    } catch (err) {
      console.error('Error saving metrics:', err);
      throw err;
    }
  }

  static async findById(id) {
    const metrics = await this.getAll();
    return metrics.find(m => m.id === id);
  }

  static async findByProjectId(projectId) {
    const metrics = await this.getAll();
    return metrics.filter(m => m.projectId === projectId);
  }

  static async findByName(name) {
    const metrics = await this.getAll();
    return metrics.filter(m => m.name === name);
  }

  static async create(data) {
    const metrics = await this.getAll();
    const metric = new ImpactMetric(
      data.projectId,
      data.name,
      data.value,
      data.measuredAt
    );
    metrics.push(metric);
    await this.saveAll(metrics);
    return metric;
  }

  static async update(id, updatedData) {
    const metrics = await this.getAll();
    const index = metrics.findIndex(m => m.id === id);
    
    if (index === -1) return null;
    
    const updatedMetric = {
      ...metrics[index],
      ...updatedData,
      lastUpdated: new Date().toISOString(),
      id: metrics[index].id
    };
    
    metrics[index] = updatedMetric;
    await this.saveAll(metrics);
    return updatedMetric;
  }

  static async delete(id) {
    const metrics = await this.getAll();
    const originalLength = metrics.length;
    const filteredMetrics = metrics.filter(m => m.id !== id);
    
    if (filteredMetrics.length === originalLength) {
      return false;
    }
    
    await this.saveAll(filteredMetrics);
    return true;
  }

  static async getMetricsSummary(projectId) {
    const metrics = await this.findByProjectId(projectId);
    return {
      count: metrics.length,
      metricsByType: metrics.reduce((acc, metric) => {
        acc[metric.name] = (acc[metric.name] || 0) + metric.value;
        return acc;
      }, {})
    };
  }
}