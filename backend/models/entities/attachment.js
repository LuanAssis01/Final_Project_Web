import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '../../data/attachments.json');

const ensureFileExists = async () => {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, '[]', 'utf-8');
  }
};

await ensureFileExists();

export class Attachment {
  constructor(projectId, filename, url, fileType, size) {
    this.id = randomUUID();
    this.projectId = projectId;
    this.filename = filename;
    this.url = url;
    this.fileType = fileType || this.determineFileType(filename);
    this.size = size || 0; 
    this.uploadedAt = new Date().toISOString();
    this.updatedAt = null;
    this.description = '';
    this.isPublic = false; 
  }

  // Método auxiliar para determinar o tipo de arquivo
  determineFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const types = {
      jpg: 'image',
      jpeg: 'image',
      png: 'image',
      gif: 'image',
      pdf: 'document',
      doc: 'document',
      docx: 'document',
      xls: 'spreadsheet',
      xlsx: 'spreadsheet',
      ppt: 'presentation',
      pptx: 'presentation',
      mp4: 'video',
      mov: 'video',
      mp3: 'audio',
      zip: 'archive',
      txt: 'text'
    };
    return types[extension] || 'other';
  }

  static async getAll() {
    try {
      const data = await fs.readFile(DATA_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Erro ao ler anexos:', err);
      return [];
    }
  }

  static async saveAll(attachments) {
    try {
      await fs.writeFile(DATA_PATH, JSON.stringify(attachments, null, 2));
    } catch (err) {
      console.error('Erro ao salvar anexos:', err);
      throw err;
    }
  }

  static async findById(id) {
    const attachments = await this.getAll();
    return attachments.find(a => a.id === id);
  }

  static async findByProjectId(projectId) {
    const attachments = await this.getAll();
    return attachments.filter(a => a.projectId === projectId);
  }

  static async findByFileType(fileType) {
    const attachments = await this.getAll();
    return attachments.filter(a => a.fileType === fileType);
  }

  static async create(data) {
    const attachments = await this.getAll();
    const attachment = new Attachment(
      data.projectId,
      data.filename,
      data.url,
      data.fileType,
      data.size
    );
    
    if (data.description) attachment.description = data.description;
    if (data.isPublic !== undefined) attachment.isPublic = data.isPublic;
    
    attachments.push(attachment);
    await this.saveAll(attachments);
    return attachment;
  }

  static async update(id, updatedData) {
    const attachments = await this.getAll();
    const index = attachments.findIndex(a => a.id === id);
    
    if (index === -1) return null;
    
    const updatedAttachment = {
      ...attachments[index],
      ...updatedData,
      updatedAt: new Date().toISOString(),
      id: attachments[index].id 
    };
    
    attachments[index] = updatedAttachment;
    await this.saveAll(attachments);
    return updatedAttachment;
  }

  static async delete(id) {
    const attachments = await this.getAll();
    const originalLength = attachments.length;
    const filteredAttachments = attachments.filter(a => a.id !== id);
    
    if (filteredAttachments.length === originalLength) {
      return false;
    }
    
    await this.saveAll(filteredAttachments);
    return true;
  }

  static async getProjectAttachmentsSummary(projectId) {
    const attachments = await this.findByProjectId(projectId);
    const summary = {
      total: attachments.length,
      byType: attachments.reduce((acc, attachment) => {
        acc[attachment.fileType] = (acc[attachment.fileType] || 0) + 1;
        return acc;
      }, {}),
      totalSize: attachments.reduce((sum, attachment) => sum + (attachment.size || 0), 0)
    };
    return summary;
  }
}