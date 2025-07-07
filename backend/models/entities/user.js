import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '../../data/user.json');

const ensureFileExists = async () => {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, '[]', 'utf-8');
  }
};

await ensureFileExists();

export class User {
  constructor(name, email, password, role) {
    this.id = randomUUID();
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static async getAll() {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  }

  static async saveAll(users) {
    await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2));
  }

  static async findById(id) {
    const users = await this.getAll();
    return users.find(user => user.id === id);
  }

  static async create(userData) {
    const users = await this.getAll();
    const user = new User(userData.name, userData.email, userData.password, userData.role);
    users.push(user);
    await this.saveAll(users);
    return user;
  }

  static async update(id, updatedData) {
    const users = await this.getAll();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updatedData };
    await this.saveAll(users);
    return users[index];
  }

  static async delete(id) {
    const users = await this.getAll();
    const filtered = users.filter(user => user.id !== id);
    if (filtered.length === users.length) return false;
    await this.saveAll(filtered);
    return true;
  }
}
