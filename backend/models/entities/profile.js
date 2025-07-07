import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises'; 
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '../../data/profiles.json');

const ensureFileExists = async () => {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, '[]', 'utf-8');
  }
};

await ensureFileExists();

export class Profile {
  constructor(userId, bio, institution, location) {
    this.id = randomUUID();
    this.userId = userId;
    this.bio = bio;
    this.institution = institution;
    this.location = location;
  }

  static async getAll() {
    try {
      const data = await fs.readFile(DATA_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  static async saveAll(profiles) {
    await fs.writeFile(DATA_PATH, JSON.stringify(profiles, null, 2));
  }

  static async findByUserId(userId) {
    const profiles = await this.getAll();
    return profiles.find(profile => profile.userId === userId);
  }

  static async findById(id) {
    const profiles = await this.getAll();
    return profiles.find(profile => profile.id === id);
  }

  static async create(data) {
    const profiles = await this.getAll();
    const profile = new Profile(
      data.userId,
      data.bio,
      data.institution,
      data.location
    );
    profiles.push(profile);
    await this.saveAll(profiles);
    return profile;
  }

  static async update(id, updatedData) {
    const profiles = await this.getAll();
    const index = profiles.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    const updatedProfile = { 
      ...profiles[index], 
      ...updatedData,
      id: profiles[index].id // Garantindo que o ID não seja alterado
    };
    
    profiles[index] = updatedProfile;
    await this.saveAll(profiles);
    return updatedProfile;
  }

  static async delete(id) {
    const profiles = await this.getAll();
    const originalLength = profiles.length;
    const filteredProfiles = profiles.filter(p => p.id !== id);
    
    if (filteredProfiles.length === originalLength) {
      return false;
    }
    
    await this.saveAll(filteredProfiles);
    return true;
  }
}