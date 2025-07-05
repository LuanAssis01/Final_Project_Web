import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../../../data/projects.json');

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

  static getAll() {
    if (!fs.existsSync(DATA_PATH)) return [];
    const data = fs.readFileSync(DATA_PATH);
    return JSON.parse(data);
  }

  static saveAll(projects) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(projects, null, 2));
  }

  static findById(id) {
    return this.getAll().find(p => p.id === id);
  }

  static create(projectData) {
    const projects = this.getAll();
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
    this.saveAll(projects);
    return newProject;
  }

  static update(id, updatedData) {
    const projects = this.getAll();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    projects[index] = { ...projects[index], ...updatedData };
    this.saveAll(projects);
    return projects[index];
  }

  static delete(id) {
    let projects = this.getAll();
    const originalLength = projects.length;
    projects = projects.filter(p => p.id !== id);
    if (projects.length === originalLength) return false;
    this.saveAll(projects);
    return true;
  }
}
