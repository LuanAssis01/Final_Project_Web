import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../../../data/users.json');
export class User {
  constructor(name, email, password, role) {
    this.id = randomUUID();
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static getAll() {
    if (!fs.existsSync(DATA_PATH)) return [];
    const data = fs.readFileSync(DATA_PATH);
    return JSON.parse(data);
  }

  static saveAll(users) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2));
  }

  static findById(id) {
    return this.getAll().find(user => user.id === id);
  }

  static create(userData) {
    const users = this.getAll();
    const user = new User(userData.name, userData.email, userData.password, userData.role);
    users.push(user);
    this.saveAll(users);
    return user;
  }

  static update(id, updatedData) {
    const users = this.getAll();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updatedData };
    this.saveAll(users);
    return users[index];
  }

  static delete(id) {
    let users = this.getAll();
    const originalLength = users.length;
    users = users.filter(user => user.id !== id);
    if (users.length === originalLength) return false;

    this.saveAll(users);
    return true;
  }
}