import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '../../data/projects.json');

const ensureFileExists = async () => {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, '[]', 'utf-8');
  }
};

await ensureFileExists();

export class Project {
  constructor(title, description, thematicArea, category, startDate, endDate, status = 'ACTIVE') {
    this.id = randomUUID();
    this.title = title;
    this.description = description;
    this.thematicArea = thematicArea;
    this.category = category;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.metrics = [];
    this.attachments = [];
    this.comments = [];
    this.requests = [];
    this.history = [];
  }

  static async getAll() {
    try {
      const data = await fs.readFile(DATA_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  static async saveAll(projects) {
    await fs.writeFile(DATA_PATH, JSON.stringify(projects, null, 2));
  }

  static async findById(id) {
    const projects = await this.getAll();
    return projects.find(p => p.id === id);
  }

  static async create(projectData) {
    const projects = await this.getAll();
    const newProject = new Project(
      projectData.title,
      projectData.description,
      projectData.thematicArea,
      projectData.category,
      projectData.startDate,
      projectData.endDate,
      projectData.status
    );
    projects.push(newProject);
    await this.saveAll(projects);
    return newProject;
  }

  static async update(id, updatedData) {
    const projects = await this.getAll();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    projects[index] = { ...projects[index], ...updatedData };
    await this.saveAll(projects); 
    return projects[index];
  }

  static async delete(id) {
    const projects = await this.getAll();
    const filtered = projects.filter(p => p.id !== id); 
    if (filtered.length === projects.length) return false;
    await this.saveAll(filtered);
    return true;
  }
}