import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../../../data/profiles.json');

export class Profile {
  constructor(userId, bio, institution, location) {
    this.id = randomUUID();
    this.userId = userId;
    this.bio = bio;
    this.institution = institution;
    this.location = location;
  }

  static getAll() {
    if (!fs.existsSync(DATA_PATH)) return [];
    const data = fs.readFileSync(DATA_PATH);
    return JSON.parse(data);
  }

  static saveAll(profiles) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(profiles, null, 2));
  }

  static findByUserId(userId) {
    return this.getAll().find(profile => profile.userId === userId);
  }

  static findById(id) {
    return this.getAll().find(profile => profile.id === id);
  }

  static create(data) {
    const profiles = this.getAll();
    const profile = new Profile(data.userId, data.bio, data.institution, data.location);
    profiles.push(profile);
    this.saveAll(profiles);
    return profile;
  }

  static update(id, updatedData) {
    const profiles = this.getAll();
    const index = profiles.findIndex(p => p.id === id);
    if (index === -1) return null;
    profiles[index] = { ...profiles[index], ...updatedData };
    this.saveAll(profiles);
    return profiles[index];
  }

  static delete(id) {
    let profiles = this.getAll();
    const originalLength = profiles.length;
    profiles = profiles.filter(p => p.id !== id);
    if (profiles.length === originalLength) return false;
    this.saveAll(profiles);
    return true;
  }
}
